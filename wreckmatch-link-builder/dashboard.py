"""
Streamlit dashboard for the WreckMatch Link Builder.

Run with: streamlit run dashboard.py

Tabbed UI: Dashboard | Prospecting | Email Generator | Tracker | Settings
All outreach requires human review — the dashboard never sends emails.
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd
import streamlit as st

from config import BRAND, PILOT_SEARCH_QUERIES, PROSPECT_TYPES, SEARCH_QUERY_TEMPLATES, STATUSES, AppConfig
from logger_setup import log_error_with_context, setup_logger
from outreach_generator import TEMPLATE_TYPES, OutreachGenerator
from pilot import run_pilot
from prospector import Prospector, ProspectorError, SearchQueryGenerator
from tracker import ProspectTracker, TrackerError

logger = setup_logger(__name__)

st.set_page_config(
    page_title="WreckMatch Link Builder",
    page_icon="🔗",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
    .main-header { font-size: 2rem; font-weight: 700; color: #1a365d; margin-bottom: 0.25rem; }
    .sub-header { color: #4a5568; font-size: 1rem; margin-bottom: 1rem; }
    .safety-banner {
        background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px;
        padding: 12px 16px; margin-bottom: 1rem; color: #856404;
    }
    .stat-box {
        background: linear-gradient(135deg, #ebf8ff 0%, #f7fafc 100%);
        border-radius: 10px; padding: 1rem 1.25rem;
        border-left: 4px solid #3182ce;
    }
    </style>
    """,
    unsafe_allow_html=True,
)


def _safety_banner() -> None:
    st.markdown(
        '<div class="safety-banner">'
        "⚠️ <strong>Human review required</strong> — Drafts only. Never auto-send. "
        "Rate limits: 6 req/min, 8–25s delays."
        "</div>",
        unsafe_allow_html=True,
    )


@st.cache_resource
def _get_config() -> AppConfig:
    return AppConfig.from_env()


def _render_stats_row(stats: dict[str, int]) -> None:
    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("Total Prospects", stats.get("total", 0))
    c2.metric("Links Acquired", stats.get("links_acquired", 0))
    c3.metric("New", stats.get("status_new", 0))
    c4.metric("Drafts Ready", stats.get("email_drafted", 0))
    c5.metric("Contacted", stats.get("contacted", 0))


def _sidebar(config: AppConfig) -> None:
    st.sidebar.markdown("## 🔗 WreckMatch Link Builder")
    st.sidebar.markdown(f"[{BRAND.website}]({BRAND.website})")
    st.sidebar.markdown(f"📞 {BRAND.phone}")
    st.sidebar.markdown("---")

    tracker = ProspectTracker(config)
    st.sidebar.info(f"**Storage:** {'Google Sheets' if tracker.uses_google_sheets else 'Local CSV'}")
    cse_ok = bool(config.google_cse_api_key and config.google_cse_cx)
    st.sidebar.markdown(f"**Google CSE:** {'✅ Ready' if cse_ok else '❌ Not configured'}")
    st.sidebar.markdown("---")
    st.sidebar.caption("White-hat link building · Drafts only")


def _tab_dashboard(config: AppConfig) -> None:
    st.markdown('<p class="main-header">Dashboard</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="sub-header">Connect car accident victims with attorneys — one quality link at a time</p>',
        unsafe_allow_html=True,
    )
    _safety_banner()

    tracker = ProspectTracker(config)
    stats = tracker.stats()
    _render_stats_row(stats)

    st.markdown("### 🚀 Quick Start")
    q1, q2, q3 = st.columns(3)

    with q1:
        st.markdown("**Run First Pilot**")
        st.caption("Find 10–20 resource pages + draft emails")
        if st.button("▶️ Run Pilot Now", type="primary", use_container_width=True, key="dash_pilot"):
            st.session_state["run_pilot"] = True

    with q2:
        st.markdown("**One-Click Search**")
        st.caption("Search car accident lawyer resources")
        if st.button("🔍 Quick Prospect Search", use_container_width=True, key="dash_search"):
            st.session_state["quick_search"] = True

    with q3:
        st.markdown("**Export Data**")
        st.caption("Download tracker as CSV")
        if st.button("📥 Export CSV", use_container_width=True, key="dash_export"):
            try:
                path = tracker.export_csv()
                st.success(f"Exported to `{path}`")
            except TrackerError as exc:
                st.error(str(exc))

    if st.session_state.pop("run_pilot", False):
        with st.spinner("Running pilot… several minutes, rate-limited."):
            try:
                result = run_pilot(config=config)
                st.success(
                    f"Pilot done: **{result.prospects_found}** prospects, "
                    f"**{result.emails_generated}** drafts → `{result.drafts_dir}`"
                )
            except (ProspectorError, TrackerError) as exc:
                st.error(str(exc))

    if st.session_state.pop("quick_search", False):
        _run_prospecting(config, mode="search", max_queries=4)

    st.markdown("### Mission")
    st.info(
        f"**{BRAND.mission}** — Use this tool to build ethical backlinks that help "
        f"accident victims find {BRAND.website} through trusted resource pages."
    )

    st.markdown("### Strategies")
    st.markdown(
        """
| Strategy | What it does |
|----------|--------------|
| **Resource pages** | Suggest WreckMatch for curated legal link lists |
| **Broken links** | Offer WreckMatch as a replacement for dead links |
| **Unlinked mentions** | Thank sites that mention WreckMatch without linking |
| **Legal directories** | Track listing opportunities on attorney directories |
        """
    )


def _run_prospecting(config: AppConfig, mode: str, max_queries: int = 3, urls: list[str] | None = None) -> None:
    prospector = Prospector(config)
    try:
        with st.spinner("Prospecting… rate-limited, please wait."):
            prospects = prospector.find_prospects(mode=mode, urls=urls, max_queries=max_queries)
    except Exception as exc:
        log_error_with_context(logger, "Dashboard prospecting failed", exc, mode=mode)
        st.error(f"Prospecting failed: {exc}")
        return
    finally:
        prospector.close()

    if not prospects:
        st.warning("No prospects found. Configure Google CSE in `.env` or provide URLs.")
        return

    tracker = ProspectTracker(config)
    try:
        added = tracker.add_prospects([p.to_dict() for p in prospects])
    except TrackerError as exc:
        st.error(str(exc))
        return

    st.success(f"✅ Found **{len(prospects)}** prospects — **{added}** new rows saved.")
    st.dataframe(pd.DataFrame([p.to_dict() for p in prospects]), use_container_width=True, hide_index=True)


def _tab_prospecting(config: AppConfig) -> None:
    st.markdown('<p class="main-header">Prospecting</p>', unsafe_allow_html=True)
    _safety_banner()

    cse_ok = bool(config.google_cse_api_key and config.google_cse_cx)
    if not cse_ok:
        st.error("Google CSE not configured. Add `GOOGLE_CSE_API_KEY` and `GOOGLE_CSE_CX` to `.env`.")

    # One-click actions
    st.markdown("### One-Click Actions")
    b1, b2, b3, b4 = st.columns(4)

    if b1.button("🎯 Run Full Pilot", type="primary", use_container_width=True):
        st.session_state["run_pilot"] = True
    if b2.button("🔍 Search Resources", use_container_width=True):
        st.session_state["quick_search"] = True
    if b3.button("🔗 Scan Broken Links", use_container_width=True):
        st.session_state["broken_scan"] = True
    if b4.button("📋 Check Directories", use_container_width=True):
        st.session_state["dir_check"] = True

    if st.session_state.pop("run_pilot", False):
        with st.spinner("Running pilot… this takes several minutes (rate-limited)."):
            try:
                result = run_pilot(config=config)
                st.success(
                    f"Pilot complete: **{result.prospects_found}** prospects, "
                    f"**{result.emails_generated}** drafts in `{result.drafts_dir}`"
                )
                st.info(f"Full report: `{result.report_path}`")
            except ProspectorError as exc:
                st.error(str(exc))
            except TrackerError as exc:
                st.error(str(exc))

    if st.session_state.pop("quick_search", False):
        _run_prospecting(config, mode="search", max_queries=4)

    if st.session_state.pop("broken_scan", False):
        _run_prospecting(config, mode="broken", max_queries=2)

    if st.session_state.pop("dir_check", False):
        _run_prospecting(config, mode="directories")

    st.markdown("---")
    st.markdown("### Advanced Prospecting")

    mode = st.selectbox(
        "Mode",
        [
            ("search", "Google Search (CSE)"),
            ("resource", "Resource Page Analysis"),
            ("broken", "Broken Link Finder"),
            ("directories", "Legal Directory Tracker"),
            ("all", "Search + Resource Analysis"),
        ],
        format_func=lambda x: x[1],
    )[0]

    max_queries = st.slider("Max search queries", 1, 10, 3)
    urls_text = st.text_area("URLs (one per line, optional)", height=80)
    urls = [u.strip() for u in urls_text.splitlines() if u.strip()] or None

    with st.expander("Pilot search queries"):
        for q in PILOT_SEARCH_QUERIES:
            st.code(q)

    if st.button("▶️ Run Custom Prospecting", type="secondary"):
        _run_prospecting(config, mode=mode, max_queries=max_queries, urls=urls)


def _tab_email_generator(config: AppConfig) -> None:
    st.markdown('<p class="main-header">Email Generator</p>', unsafe_allow_html=True)
    _safety_banner()

    tracker = ProspectTracker(config)
    try:
        prospects = tracker.get_prospects_for_outreach(limit=50)
    except TrackerError as exc:
        st.error(str(exc))
        return

    if not prospects:
        st.info("No eligible prospects. Run **Prospecting** or the **Pilot** first.")
        return

    st.markdown(f"**{len(prospects)}** prospects ready for drafting.")

    c1, c2 = st.columns([2, 1])
    with c1:
        selected_idx = st.selectbox(
            "Prospect",
            range(len(prospects)),
            format_func=lambda i: (
                f"{prospects[i].get('domain', '?')} — "
                f"{prospects[i].get('url', '')[:55]}"
            ),
        )
    with c2:
        batch_size = st.number_input("Batch generate", min_value=1, max_value=20, value=5)

    prospect = prospects[selected_idx]
    template = st.selectbox(
        "Template",
        TEMPLATE_TYPES,
        index=_template_index(prospect),
        format_func=lambda t: t.replace("_", " ").title(),
    )

    col1, col2 = st.columns(2)
    contact_name = col1.text_input("Contact name", value=prospect.get("contact_name", ""))
    contact_email = col2.text_input("Contact email", value=prospect.get("contact_email", ""))
    personal_note = st.text_area("Personal note (optional)", height=80)

    g1, g2 = st.columns(2)
    if g1.button("✉️ Generate Single Draft", type="primary", use_container_width=True):
        _generate_single(config, tracker, prospect, template, contact_name, contact_email, personal_note)

    if g2.button(f"📨 Batch Generate ({batch_size})", use_container_width=True):
        _generate_batch(config, tracker, prospects[:batch_size])

    if "last_email" in st.session_state:
        email = st.session_state["last_email"]
        st.markdown("### Draft Preview")
        st.warning("Review and edit before sending manually.")
        st.text_input("Subject", value=email["subject"], disabled=True)
        st.text_area("Body", value=email["body"], height=400)
        st.download_button(
            "Download draft",
            data=f"Subject: {email['subject']}\n\n{email['body']}",
            file_name=f"draft_{email.get('contact_name', 'outreach')}.txt",
        )


def _template_index(prospect: dict) -> int:
    return {
        "broken_link": 0,
        "resource_page": 1,
        "unlinked_mention": 2,
        "guest_post": 3,
    }.get(prospect.get("prospect_type", ""), 1)


def _generate_single(
    config: AppConfig,
    tracker: ProspectTracker,
    prospect: dict,
    template: str,
    contact_name: str,
    contact_email: str,
    personal_note: str,
) -> None:
    generator = OutreachGenerator(config)
    row = dict(prospect)
    row["contact_name"] = contact_name
    row["contact_email"] = contact_email
    email = generator.generate_for_prospect(row, template_type=template)
    body = email.body
    if personal_note:
        body = body.replace("\n\nBest regards,", f"\n\n{personal_note}\n\nBest regards,")
    email_dict = email.to_dict()
    email_dict["body"] = body
    st.session_state["last_email"] = email_dict
    try:
        tracker.update_status(
            prospect["id"],
            status="email_drafted",
            outreach_template=template,
        )
        st.success("Draft generated and tracker updated.")
    except TrackerError as exc:
        st.error(str(exc))


def _generate_batch(config: AppConfig, tracker: ProspectTracker, prospects: list[dict]) -> None:
    generator = OutreachGenerator(config)
    count = 0
    drafts_dir = config.data_dir / "drafts" / "batch"
    drafts_dir.mkdir(parents=True, exist_ok=True)
    for prospect in prospects:
        try:
            email = generator.generate_for_prospect(prospect)
            path = drafts_dir / f"draft_{prospect['id']}.txt"
            path.write_text(f"Subject: {email.subject}\n\n{email.body}", encoding="utf-8")
            tracker.update_status(
                prospect["id"],
                status="email_drafted",
                outreach_template=email.template_type,
            )
            count += 1
        except Exception as exc:
            log_error_with_context(logger, "Batch draft failed", exc, url=prospect.get("url"))
    st.success(f"Generated **{count}** drafts in `{drafts_dir}`")


def _tab_tracker(config: AppConfig) -> None:
    st.markdown('<p class="main-header">Tracker</p>', unsafe_allow_html=True)

    tracker = ProspectTracker(config)
    try:
        df = tracker.load()
    except TrackerError as exc:
        st.error(str(exc))
        return

    if len(df) == 0:
        st.info("Tracker is empty. Run the **Pilot** or **Prospecting** tab first.")
        return

    stats = tracker.stats()
    _render_stats_row(stats)

    c1, c2, c3 = st.columns(3)
    status_filter = c1.multiselect("Filter by status", STATUSES)
    type_filter = c2.multiselect("Filter by type", PROSPECT_TYPES)
    search = c3.text_input("Search URL/domain")

    filtered = df.copy()
    if status_filter:
        filtered = filtered[filtered["status"].isin(status_filter)]
    if type_filter:
        filtered = filtered[filtered["prospect_type"].isin(type_filter)]
    if search:
        filtered = filtered[
            filtered["url"].str.contains(search, case=False, na=False)
            | filtered["domain"].str.contains(search, case=False, na=False)
        ]

    st.caption(f"Showing {len(filtered)} of {len(df)} prospects")

    edited = st.data_editor(
        filtered,
        use_container_width=True,
        hide_index=True,
        column_config={
            "status": st.column_config.SelectboxColumn("Status", options=list(STATUSES)),
            "prospect_type": st.column_config.SelectboxColumn("Type", options=list(PROSPECT_TYPES)),
            "link_acquired": st.column_config.SelectboxColumn("Link?", options=["no", "yes"]),
        },
    )

    if st.button("💾 Save Changes", type="primary"):
        try:
            full = df.set_index("id")
            full.update(edited.set_index("id"))
            tracker.save(full.reset_index())
            st.success("Tracker saved.")
            st.rerun()
        except TrackerError as exc:
            st.error(str(exc))


def _tab_settings(config: AppConfig) -> None:
    st.markdown('<p class="main-header">Settings</p>', unsafe_allow_html=True)

    tracker = ProspectTracker(config)

    st.markdown("### Export")
    if st.button("📥 Export Tracker to CSV"):
        try:
            path = tracker.export_csv()
            st.success(f"Exported to `{path}`")
            st.download_button("Download", path.read_text(), file_name=path.name)
        except TrackerError as exc:
            st.error(str(exc))

    st.markdown("### Configuration Status")
    st.json({
        "google_cse": bool(config.google_cse_api_key and config.google_cse_cx),
        "google_sheets": tracker.uses_google_sheets,
        "rate_limit": f"{config.max_requests_per_minute} req/min",
        "delay": f"{config.min_delay_seconds}–{config.max_delay_seconds}s",
        "sender": config.outreach_sender_name,
        "data_dir": str(config.data_dir),
        "logs": str(config.log_dir),
    })

    st.markdown("### All Search Query Templates")
    st.code("\n".join(SEARCH_QUERY_TEMPLATES))

    st.markdown("### Setup Help")
    st.markdown(
        """
1. Copy `.env.example` → `.env`
2. Add Google CSE API key + search engine ID
3. (Optional) Add Google Sheets service account
4. Run `python pilot.py` for your first campaign
        """
    )


def main() -> None:
    config = _get_config()
    _sidebar(config)

    st.markdown('<p class="main-header">WreckMatch Link Builder</p>', unsafe_allow_html=True)

    from dashboard_syndication import render_firm_tab, render_syndication_tab

    tab_labels = [
        "Dashboard",
        "Prospecting",
        "Email Generator",
        "Social Posts",
        "Firm Partners",
        "Tracker",
        "Settings",
    ]
    tabs = st.tabs(tab_labels)

    with tabs[0]:
        _tab_dashboard(config)
    with tabs[1]:
        _tab_prospecting(config)
    with tabs[2]:
        _tab_email_generator(config)
    with tabs[3]:
        render_syndication_tab()
    with tabs[4]:
        render_firm_tab(config)
    with tabs[5]:
        _tab_tracker(config)
    with tabs[6]:
        _tab_settings(config)


if __name__ == "__main__":
    main()
