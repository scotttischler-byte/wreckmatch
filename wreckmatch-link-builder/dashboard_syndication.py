"""Streamlit tab: copy-paste syndication posts from injuredhelp.ai."""

from __future__ import annotations

import streamlit as st

from syndication_reader import format_weekend_queue, load_all, load_latest, syndication_dir


def render_syndication_tab() -> None:
    st.markdown('<p class="main-header">Social posts (copy-paste)</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="sub-header">Latest blog syndication from Traffic Machine — post manually to LinkedIn, X, Reddit</p>',
        unsafe_allow_html=True,
    )

    root = syndication_dir()
    if not root.is_dir():
        st.error(f"Syndication folder not found: `{root}`")
        st.info("Set `SYNDICATION_DIR` in `.env` to injuredhelp.ai/content/syndication")
        return

    st.caption(f"Reading: `{root}`")

    latest = load_latest()
    if latest:
        st.markdown("### Latest post")
        st.markdown(f"**[{latest.title}]({latest.url})** · `{latest.vertical}`")
        c1, c2, c3 = st.columns(3)
        with c1:
            st.text_area("LinkedIn", latest.linkedin, height=200, key="syn_li")
        with c2:
            st.text_area("X / Twitter", latest.twitter, height=200, key="syn_tw")
        with c3:
            st.text_area("Reddit", latest.reddit_body, height=200, key="syn_rd")

    st.markdown("### Recent queue")
    posts = load_all(limit=12)
    if not posts:
        st.warning("No syndication JSON files yet. Run blog autopilot with `--syndicate`.")
        return

    for p in posts[:8]:
        with st.expander(f"{p.title[:70]}…" if len(p.title) > 70 else p.title):
            st.link_button("Open article", p.url)
            st.text_area("LinkedIn", p.linkedin, height=120, key=f"li_{p.slug}")
            st.text_area("Reddit", p.reddit_body, height=120, key=f"rd_{p.slug}")

    st.markdown("### Weekend queue (export)")
    weekend_md = format_weekend_queue(posts[:6])
    st.download_button(
        "Download weekend-posting.md",
        weekend_md,
        file_name="wreckmatch-weekend-social.md",
        mime="text/markdown",
    )
    if st.button("Show weekend markdown"):
        st.markdown(weekend_md)


def render_firm_tab(config) -> None:
    from firm_outreach import FIRM_PARTNERS_CSV, generate_drafts
    from tracker import ProspectTracker

    st.markdown('<p class="main-header">Firm partner backlinks</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="sub-header">Mail-merge footer/resource link asks for participating firms</p>',
        unsafe_allow_html=True,
    )

    path = config.data_dir / FIRM_PARTNERS_CSV
    st.caption(f"CSV: `{path}`")

    if not path.exists():
        st.warning("Copy `firm_partners.template.csv` → `firm_partners.csv` and add real contacts.")
        return

    import pandas as pd

    df = pd.read_csv(path)
    st.dataframe(df, use_container_width=True, hide_index=True)

    limit = st.number_input("Max drafts", 5, 50, 20)
    if st.button("Generate firm email drafts", type="primary"):
        try:
            out = generate_drafts(config, limit=int(limit))
            st.success(f"Drafts saved to `{out}` — review and send manually.")
        except FileNotFoundError as exc:
            st.error(str(exc))

    stats = ProspectTracker(config).stats()
    st.metric("Resource prospects (tracker)", stats.get("total", 0))
