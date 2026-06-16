#!/usr/bin/env node

/**
 * WreckMatch PI/MVA attorney email campaign planner.
 *
 * Dry-run is the default. Sending requires both --send and
 * --confirm=SEND_ATTORNEY_CAMPAIGN so batch email workflows cannot be
 * triggered accidentally.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEFAULT_DATA_DIR = path.join(ROOT, "data", "attorney-campaign");
const DEFAULT_ATTORNEYS = path.join(DEFAULT_DATA_DIR, "attorneys.csv");
const DEFAULT_LEADS = path.join(DEFAULT_DATA_DIR, "leads.csv");
const DEFAULT_AUDIENCE = path.join(DEFAULT_DATA_DIR, "audience-labs.csv");
const TEMPLATE_ATTORNEYS = path.join(DEFAULT_DATA_DIR, "attorneys.template.csv");
const TEMPLATE_LEADS = path.join(DEFAULT_DATA_DIR, "leads.template.csv");
const TEMPLATE_AUDIENCE = path.join(DEFAULT_DATA_DIR, "audience-labs.template.csv");
const DEFAULT_LOG = path.join(ROOT, "content", "agents", "attorney-campaign-log.jsonl");

const CAMPAIGN_TRIGGER = "pi_mva_attorney_email_campaign";
const SEND_CONFIRMATION = "SEND_ATTORNEY_CAMPAIGN";
const PLACEHOLDER_RE = /example\.com|placeholder|replace_with/i;
const INVALID_STATUSES = new Set([
  "bounced",
  "do-not-contact",
  "do not contact",
  "dnc",
  "inactive",
  "opted-out",
  "opted out",
  "unsubscribed",
]);

const STATE_NAMES = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

function parseArgs(argv) {
  const args = {
    attorneys: DEFAULT_ATTORNEYS,
    leads: DEFAULT_LEADS,
    audienceLabs: DEFAULT_AUDIENCE,
    output: "",
    log: DEFAULT_LOG,
    campaignId: `wm-attorney-${new Date().toISOString().slice(0, 10)}`,
    webhookUrl:
      process.env.ATTORNEY_CAMPAIGN_WEBHOOK_URL ||
      process.env.GHL_ATTORNEY_CAMPAIGN_WEBHOOK_URL ||
      "",
    lookbackDays: 90,
    limit: 0,
    onlyState: "",
    send: false,
    confirm: "",
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const equalsIndex = arg.indexOf("=");
    const name = arg.startsWith("--") && equalsIndex !== -1 ? arg.slice(0, equalsIndex) : arg;
    const inlineValue = arg.startsWith("--") && equalsIndex !== -1 ? arg.slice(equalsIndex + 1) : undefined;
    const nextValue = () => inlineValue ?? argv[++i] ?? "";

    switch (name) {
      case "--attorneys":
        args.attorneys = path.resolve(ROOT, nextValue());
        break;
      case "--leads":
        args.leads = path.resolve(ROOT, nextValue());
        break;
      case "--audience-labs":
        args.audienceLabs = path.resolve(ROOT, nextValue());
        break;
      case "--output":
        args.output = path.resolve(ROOT, nextValue());
        break;
      case "--log":
        args.log = path.resolve(ROOT, nextValue());
        break;
      case "--campaign-id":
        args.campaignId = nextValue();
        break;
      case "--webhook-url":
        args.webhookUrl = nextValue();
        break;
      case "--lookback-days":
        args.lookbackDays = Number(nextValue()) || args.lookbackDays;
        break;
      case "--limit":
        args.limit = Number(nextValue()) || 0;
        break;
      case "--only-state":
        args.onlyState = normalizeState(nextValue());
        break;
      case "--send":
        args.send = true;
        break;
      case "--dry-run":
        args.send = false;
        break;
      case "--confirm":
        args.confirm = nextValue();
        break;
      case "--help":
      case "-h":
        args.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/attorney-email-campaign.mjs [options]

Inputs default to:
  data/attorney-campaign/attorneys.csv
  data/attorney-campaign/leads.csv
  data/attorney-campaign/audience-labs.csv

Options:
  --attorneys <file>       CSV, JSON, or JSONL attorney list
  --leads <file>           CSV, JSON, or JSONL de-identified/current lead export
  --audience-labs <file>   CSV, JSON, or JSONL Audience Labs export
  --output <file>          Write dry-run payloads to JSON
  --campaign-id <id>       Campaign identifier passed to GHL
  --lookback-days <n>      Recent lead window for dated exports (default: 90)
  --only-state <state>     Restrict to a single state
  --limit <n>              Process at most n attorneys
  --send                   POST payloads to ATTORNEY_CAMPAIGN_WEBHOOK_URL
  --confirm ${SEND_CONFIRMATION}
                           Required with --send
`);
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
  }
}

function ensureFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} not found: ${path.relative(ROOT, filePath)}`);
  }
}

function resolveInputFile(filePath, defaultPath, templatePath, label, send) {
  if (fs.existsSync(filePath)) return filePath;
  if (!send && filePath === defaultPath && fs.existsSync(templatePath)) {
    console.warn(
      `${label} not found; using template data for dry run: ${path.relative(ROOT, templatePath)}`,
    );
    return templatePath;
  }
  ensureFile(filePath, label);
  return filePath;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  if (rows.length === 0) return [];

  const headers = rows[0].map((header) => normalizeKey(header));
  return rows.slice(1).map((cells) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = (cells[index] ?? "").trim();
    });
    return record;
  });
}

function parseJsonOrJsonl(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) return JSON.parse(trimmed);
  return trimmed
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function loadRecords(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  if (filePath.endsWith(".csv")) return parseCsv(text);
  if (filePath.endsWith(".json") || filePath.endsWith(".jsonl")) return parseJsonOrJsonl(text);
  throw new Error(`Unsupported input format for ${filePath}. Use .csv, .json, or .jsonl.`);
}

function normalizeKey(key) {
  return String(key)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function pick(record, keys) {
  for (const key of keys) {
    const normalized = normalizeKey(key);
    const value = record[normalized] ?? record[key];
    if (value !== undefined && String(value).trim()) return String(value).trim();
  }
  return "";
}

function normalizeState(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^[a-z]{2}$/i.test(raw)) return raw.toUpperCase();
  return STATE_NAMES[raw.toLowerCase()] || raw.toUpperCase();
}

function normalizeCity(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function titleCase(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return 0;
  const parsed = Number(String(value).replace(/[$,%\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function splitList(value) {
  return String(value || "")
    .split(/[;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function countValue(map, value) {
  const key = String(value || "").trim();
  if (!key) return;
  map.set(key, (map.get(key) || 0) + 1);
}

function topValues(map, limit = 3) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

function safeJoin(values) {
  return values.map((item) => `${item.value} (${item.count})`).join(", ");
}

function normalizeAttorney(record) {
  const email = pick(record, ["contact_email", "email", "attorney_email"]);
  const firmName = pick(record, ["firm_name", "law_firm", "company", "firm"]) || "Unknown Firm";
  const contactName = pick(record, ["contact_name", "name", "attorney_name"]);
  const state = normalizeState(pick(record, ["state", "licensed_state", "market_state"]));
  const cityRaw = pick(record, ["city", "market_city", "office_city"]);
  const status = pick(record, ["status", "email_status"]).toLowerCase();

  return {
    id: pick(record, ["id", "attorney_id"]) || email || firmName,
    firmName,
    contactName,
    email,
    city: titleCase(cityRaw),
    cityKey: normalizeCity(cityRaw),
    state,
    website: pick(record, ["firm_website", "website", "url"]),
    practiceAreas: splitList(pick(record, ["practice_areas", "practice_area", "practice"])),
    status,
    notes: pick(record, ["notes"]),
  };
}

function normalizeLead(record) {
  const cityState = pick(record, ["city_state", "location"]);
  const [cityFromPair, stateFromPair] = cityState.includes(",")
    ? cityState.split(",", 2).map((part) => part.trim())
    : ["", ""];
  const city = pick(record, ["city", "market_city"]) || cityFromPair;
  const state = normalizeState(pick(record, ["state", "market_state"]) || stateFromPair);
  const date =
    parseDate(pick(record, ["created_at", "created", "submitted_at", "date_created"])) ||
    parseDate(pick(record, ["accident_date", "accident_when"]));

  return {
    city: titleCase(city),
    cityKey: normalizeCity(city),
    state,
    createdAt: date,
    accidentType: pick(record, ["accident_type", "case_type", "wreck_type"]),
    injury: pick(record, ["injury_status", "injured", "injury_severity"]),
    leadSource: pick(record, ["lead_source", "source", "form_name"]),
    hasAttorney: pick(record, ["has_attorney"]),
  };
}

function normalizeAudience(record) {
  const city = pick(record, ["city", "market_city", "dma"]);
  const state = normalizeState(pick(record, ["state", "market_state"]));
  return {
    city: titleCase(city),
    cityKey: normalizeCity(city),
    state,
    segment: pick(record, ["segment", "audience_segment", "audience", "persona"]) || "PI/MVA intent",
    demandScore: toNumber(pick(record, ["demand_score", "legal_demand_score", "intent_score", "score"])),
    audienceSize: toNumber(pick(record, ["audience_size", "matched_users", "reach", "estimated_reach"])),
    cpc: toNumber(pick(record, ["cpc", "avg_cpc", "cost_per_click"])),
    notes: pick(record, ["notes", "insight", "summary"]),
  };
}

function isAttorneyEligible(attorney, onlyState) {
  if (!attorney.email || !isValidEmail(attorney.email)) return false;
  if (attorney.status && INVALID_STATUSES.has(attorney.status)) return false;
  if (onlyState && attorney.state !== onlyState) return false;
  return true;
}

function isRecentLead(lead, lookbackDays) {
  if (!lead.createdAt) return true;
  const cutoff = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;
  return lead.createdAt.getTime() >= cutoff;
}

function marketKey(state, cityKey = "") {
  return `${state || "NA"}::${cityKey || "*"}`;
}

function emptyStats(state = "", city = "") {
  return {
    state,
    city,
    leadCount: 0,
    accidentTypes: new Map(),
    injuries: new Map(),
    leadSources: new Map(),
    hasAttorney: new Map(),
  };
}

function buildLeadStats(leads, lookbackDays) {
  const byState = new Map();
  const byCity = new Map();
  const national = emptyStats("US", "");

  for (const lead of leads) {
    if (!lead.state || !isRecentLead(lead, lookbackDays)) continue;

    const stateKey = marketKey(lead.state);
    const cityKey = marketKey(lead.state, lead.cityKey);
    if (!byState.has(stateKey)) byState.set(stateKey, emptyStats(lead.state, ""));
    if (lead.cityKey && !byCity.has(cityKey)) byCity.set(cityKey, emptyStats(lead.state, lead.city));

    for (const stats of [national, byState.get(stateKey), lead.cityKey ? byCity.get(cityKey) : null]) {
      if (!stats) continue;
      stats.leadCount += 1;
      countValue(stats.accidentTypes, lead.accidentType);
      countValue(stats.injuries, lead.injury);
      countValue(stats.leadSources, lead.leadSource);
      countValue(stats.hasAttorney, lead.hasAttorney);
    }
  }

  return { byState, byCity, national };
}

function buildAudienceIndex(rows) {
  const byState = new Map();
  const byCity = new Map();

  for (const row of rows) {
    if (!row.state) continue;
    const stateKey = marketKey(row.state);
    const cityKey = marketKey(row.state, row.cityKey);

    if (!byState.has(stateKey)) byState.set(stateKey, []);
    byState.get(stateKey).push(row);
    if (row.cityKey) {
      if (!byCity.has(cityKey)) byCity.set(cityKey, []);
      byCity.get(cityKey).push(row);
    }
  }

  return { byState, byCity };
}

function bestAudienceFor(attorney, audienceIndex) {
  const cityRows = audienceIndex.byCity.get(marketKey(attorney.state, attorney.cityKey)) || [];
  const stateRows = audienceIndex.byState.get(marketKey(attorney.state)) || [];
  const rows = cityRows.length ? cityRows : stateRows;
  return [...rows].sort((a, b) => b.demandScore - a.demandScore || b.audienceSize - a.audienceSize)[0];
}

function statsForAttorney(attorney, leadStats) {
  return (
    leadStats.byCity.get(marketKey(attorney.state, attorney.cityKey)) ||
    leadStats.byState.get(marketKey(attorney.state)) ||
    leadStats.national
  );
}

function campaignScore(stats, audience) {
  const leadScore = Math.min(stats.leadCount * 4, 60);
  const audienceScore = Math.min((audience?.demandScore || 0) * 3, 30);
  const reachScore = Math.min(Math.floor((audience?.audienceSize || 0) / 1000), 10);
  return Math.round(leadScore + audienceScore + reachScore);
}

function buildPayload(attorney, stats, audience, args) {
  const topAccidentTypes = topValues(stats.accidentTypes);
  const topInjuries = topValues(stats.injuries);
  const topLeadSources = topValues(stats.leadSources);
  const marketLabel = attorney.city && stats.city ? `${attorney.city}, ${attorney.state}` : attorney.state;
  const score = campaignScore(stats, audience);
  const subject =
    stats.leadCount > 0
      ? `${marketLabel} MVA demand signals from WreckMatch`
      : `Audience Labs PI/MVA opportunity in ${marketLabel}`;

  return {
    campaign_id: args.campaignId,
    automation_trigger: CAMPAIGN_TRIGGER,
    recipient_type: "pi_mva_attorney",
    attorney_id: attorney.id,
    firm_name: attorney.firmName,
    contact_name: attorney.contactName,
    contact_email: attorney.email,
    firm_website: attorney.website,
    attorney_city: attorney.city,
    attorney_state: attorney.state,
    practice_areas: attorney.practiceAreas.join("; "),
    market: marketLabel,
    market_city: stats.city || attorney.city,
    market_state: attorney.state || stats.state,
    lead_count_recent: String(stats.leadCount),
    lead_lookback_days: String(args.lookbackDays),
    top_accident_types: safeJoin(topAccidentTypes),
    top_injury_signals: safeJoin(topInjuries),
    top_lead_sources: safeJoin(topLeadSources),
    audience_segment: audience?.segment || "PI/MVA intent",
    audience_demand_score: String(audience?.demandScore || 0),
    audience_size: String(audience?.audienceSize || 0),
    audience_cpc: audience?.cpc ? String(audience.cpc) : "",
    audience_notes: audience?.notes || "",
    campaign_score: String(score),
    recommended_subject: subject,
    preview_text:
      stats.leadCount > 0
        ? `WreckMatch is seeing ${stats.leadCount} recent PI/MVA lead signals in ${marketLabel}.`
        : `Audience Labs shows PI/MVA audience opportunity in ${marketLabel}.`,
    body_angle:
      stats.leadCount > 0
        ? "Lead demand proof, local injury patterns, and WreckMatch referral partnership invitation."
        : "Audience intent proof and WreckMatch referral partnership invitation.",
    compliance_note:
      "Use de-identified aggregate lead counts only. Do not include lead names, phones, emails, or case notes in attorney marketing emails.",
    created_at: new Date().toISOString(),
  };
}

function summarizePayloads(payloads) {
  const byState = new Map();
  for (const payload of payloads) {
    byState.set(payload.attorney_state, (byState.get(payload.attorney_state) || 0) + 1);
  }
  return {
    recipients: payloads.length,
    states: Object.fromEntries([...byState.entries()].sort()),
    totalRecentLeadSignals: payloads.reduce(
      (sum, payload) => sum + Number(payload.lead_count_recent || 0),
      0,
    ),
  };
}

function redactForLog(payload) {
  return {
    campaign_id: payload.campaign_id,
    automation_trigger: payload.automation_trigger,
    attorney_id: payload.attorney_id,
    firm_name: payload.firm_name,
    contact_email_domain: payload.contact_email.split("@")[1] || "",
    market: payload.market,
    campaign_score: payload.campaign_score,
  };
}

async function postPayload(webhookUrl, payload) {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

function appendLog(logPath, event) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, `${JSON.stringify({ ...event, at: new Date().toISOString() })}\n`);
}

async function main() {
  loadEnvFile(path.join(ROOT, ".secrets-setup"));
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  args.attorneys = resolveInputFile(
    args.attorneys,
    DEFAULT_ATTORNEYS,
    TEMPLATE_ATTORNEYS,
    "Attorney list",
    args.send,
  );
  args.leads = resolveInputFile(args.leads, DEFAULT_LEADS, TEMPLATE_LEADS, "Lead export", args.send);
  args.audienceLabs = resolveInputFile(
    args.audienceLabs,
    DEFAULT_AUDIENCE,
    TEMPLATE_AUDIENCE,
    "Audience Labs export",
    args.send,
  );

  if (args.send) {
    if (args.confirm !== SEND_CONFIRMATION) {
      throw new Error(`Refusing to send. Re-run with --confirm=${SEND_CONFIRMATION}.`);
    }
    if (!args.webhookUrl || PLACEHOLDER_RE.test(args.webhookUrl)) {
      throw new Error("ATTORNEY_CAMPAIGN_WEBHOOK_URL is required for --send.");
    }
  }

  const attorneys = loadRecords(args.attorneys).map(normalizeAttorney);
  const leads = loadRecords(args.leads).map(normalizeLead);
  const audienceRows = loadRecords(args.audienceLabs).map(normalizeAudience);
  const leadStats = buildLeadStats(leads, args.lookbackDays);
  const audienceIndex = buildAudienceIndex(audienceRows);

  let eligible = attorneys.filter((attorney) => isAttorneyEligible(attorney, args.onlyState));
  if (args.limit > 0) eligible = eligible.slice(0, args.limit);

  const payloads = eligible.map((attorney) =>
    buildPayload(attorney, statsForAttorney(attorney, leadStats), bestAudienceFor(attorney, audienceIndex), args),
  );

  const summary = summarizePayloads(payloads);
  console.log(
    JSON.stringify(
      {
        mode: args.send ? "send" : "dry-run",
        campaignId: args.campaignId,
        ...summary,
      },
      null,
      2,
    ),
  );

  if (args.output) {
    fs.mkdirSync(path.dirname(args.output), { recursive: true });
    fs.writeFileSync(args.output, JSON.stringify({ summary, payloads }, null, 2) + "\n");
    console.log(`Wrote preview: ${path.relative(ROOT, args.output)}`);
  }

  if (!args.send) {
    console.log("Dry run only. Add --send --confirm=SEND_ATTORNEY_CAMPAIGN after approval.");
    return;
  }

  let sent = 0;
  for (const payload of payloads) {
    const result = await postPayload(args.webhookUrl, payload);
    appendLog(args.log, {
      event: result.ok ? "attorney_campaign_payload_sent" : "attorney_campaign_payload_failed",
      status: result.status,
      payload: redactForLog(payload),
      response: result.ok ? undefined : result.body.slice(0, 500),
    });

    if (!result.ok) {
      throw new Error(`Webhook failed for ${payload.firm_name} (${result.status}): ${result.body}`);
    }
    sent += 1;
  }

  console.log(`Sent ${sent} campaign payloads to GHL.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
