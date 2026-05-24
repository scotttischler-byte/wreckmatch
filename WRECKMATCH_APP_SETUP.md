# WreckMatch Support App — moved

The mobile support app (Sarah, `/splash`, `/help`, etc.) lives in a **separate project**:

**`wreckmatch-support/`**

It must be deployed as its **own Vercel project** with its **own domain** (e.g. `support.wreckmatch.com`).

## Main site (this repo root)

- **www.wreckmatch.com** — compliance/marketing homepage + GHL chat only
- Do **not** add support app routes back under `/` or `/app`

See `wreckmatch-support/README.md` for deploy steps.
