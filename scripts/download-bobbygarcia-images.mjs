#!/usr/bin/env node
/**
 * Download curated images from bobbygarcia.com WordPress into public/bobbygarcia/
 * Usage: node scripts/download-bobbygarcia-images.mjs [--force]
 */

import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/bobbygarcia");
const MANIFEST_PATH = path.join(ROOT, "content/bobbygarcia/images.json");
const force = process.argv.includes("--force");

const BASE = "https://bobbygarcia.com/wp-content/uploads";

/** Curated assets — team, brand, practice areas, blog covers */
const ASSETS = [
  { file: "brand/logo.png", url: `${BASE}/2024/08/LOBG-Logo-2023-300dpi.png` },
  { file: "brand/logo-white.png", url: `${BASE}/2024/06/bgfulllogo-white.png` },
  { file: "team/bobby-garcia.png", url: `${BASE}/2026/02/AA-Web-Employee-Photo-Bobby.png` },
  { file: "team/arturo-garcia.png", url: `${BASE}/2026/02/AA-Web-Employee-Photo-AJ-Garcia.png` },
  { file: "team/roxana-lopez.png", url: `${BASE}/2026/02/AA-Web-Employee-Photo-Roxana.png` },
  { file: "team/gloria-salinas.png", url: `${BASE}/2026/02/AA-Web-Employee-Photo-Gloria.png` },
  { file: "team/krissy-fernandez.png", url: `${BASE}/2025/08/AA-Web-Employee-Photo-Krissy-2.png` },
  { file: "team/haley-quiroz.png", url: `${BASE}/2026/02/AA-Web-Employee-Photo-Haley.png` },
  { file: "team/tamara-rodriguez.png", url: `${BASE}/2026/05/AA-Web-Employee-Photo-Tamara.png` },
  { file: "team/norma-champion.png", url: `${BASE}/2026/02/AA-Web-Employee-Photo-Norma.png` },
  { file: "team/hilda-caldwell.png", url: `${BASE}/2026/03/AA-Web-Employee-Photo-Hilda.png` },
  { file: "team/marty-hernandez.png", url: `${BASE}/2026/02/AA-Web-Employee-Photo-Marty.png` },
  { file: "practice/car-accident.webp", url: `${BASE}/2024/07/car-accident-whiplash.jpeg` },
  { file: "practice/18-wheeler.webp", url: `${BASE}/2024/07/18-wheeler-accident.webp` },
  { file: "practice/slip-and-fall.png", url: `${BASE}/2024/07/Slip-and-Fall-Accident-Lawyer.png` },
  { file: "practice/workplace.png", url: `${BASE}/2024/08/Workplace-injury-lawyer.png` },
  { file: "practice/mass-tort.webp", url: `${BASE}/2024/06/DALL·E-2024-06-14-15.16.50-A-minimalistic-illustration-of-a-mass-tort-case-in-black-red-and-white.-The-background-is-pure-white-with-a-detailed-black-outline-of-a-large-group.webp` },
  { file: "locations/edinburg.webp", url: `${BASE}/2024/06/edinburg-bobbygarcia-com.webp` },
  { file: "locations/rio-grande-valley.jpg", url: `${BASE}/2024/08/rio-grande-valley.jpg` },
  { file: "locations/harlingen.png", url: `${BASE}/2024/08/Personal-Injury-Lawyer-Harlingen.png` },
  { file: "locations/mission.png", url: `${BASE}/2024/08/Personal-Injury-Lawyer-Mission.png` },
  { file: "locations/edinburg-office.jpeg", url: `${BASE}/2024/07/Car-accident-attorney-Edinburg-TX.jpeg` },
  { file: "hero/bobby-portrait.jpg", url: `${BASE}/2024/06/bobby-Garcoa0549-1.jpg` },
  { file: "hero/bobby-action.jpg", url: `${BASE}/2024/08/bobby-Garcoa0534.jpg` },
];

async function download(url, dest) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await pipeline(res.body, fs.createWriteStream(dest));
}

async function main() {
  const manifest = { downloadedAt: new Date().toISOString(), assets: [] };
  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const asset of ASSETS) {
    const dest = path.join(OUT, asset.file);
    const publicPath = `/bobbygarcia/${asset.file}`;
    if (fs.existsSync(dest) && !force) {
      skip++;
      manifest.assets.push({ ...asset, publicPath, status: "skipped" });
      continue;
    }
    try {
      await download(asset.url, dest);
      ok++;
      manifest.assets.push({ ...asset, publicPath, status: "ok" });
      console.log(`✓ ${asset.file}`);
    } catch (e) {
      fail++;
      manifest.assets.push({ ...asset, publicPath, status: "failed", error: String(e.message ?? e) });
      console.warn(`✗ ${asset.file}: ${e.message ?? e}`);
    }
  }

  await fs.promises.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await fs.promises.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

  console.log(`\nDone: ${ok} downloaded, ${skip} skipped, ${fail} failed`);
  console.log(`Manifest: content/bobbygarcia/images.json`);
  console.log(`Files: public/bobbygarcia/`);
  if (fail > 0) process.exitCode = 1;
}

main();
