# AGENTS.md

Non-obvious things about running this repo. Read with `README.md`.

## Stack

- `frontend/` — React 19 + Vite 6 dev server, host port **3000** -> container 5173.
- `backend/` — FastAPI (Python 3.12) on container port 8000, host port 8000.
- Storage: SQLite file at `/data/app.db` (named volume `api_data`), created on API
  startup by `backend/app/db.py:init_db`. No migrations yet.
- Single origin: the browser only calls `/api/*` on port 3000; Vite proxies it to
  `http://api:8000` (`API_PROXY_TARGET`). Do not add CORS for the frontend.

## Setup quirks

- The repo contains an empty starter scaffold; `docker-compose.base44.yml` is the
  only supported start path (`docker compose -f docker-compose.base44.yml up -d --build`).
- Dependencies are NOT baked into images. Both services install on startup
  (`pip install -r requirements.txt`, `npm install`) into named volumes
  (`web_node_modules`). Changing a manifest only needs a service restart — do not
  delete the volumes.
- `backend/` needs no package install for local syntax checks; `python -m compileall`
  works inside the `api` container.
- No test suite, linter or CI config exists yet. Verify by hand:
  - `curl -s localhost:3000/api/health` → `{"status":"ok"}`
  - `curl -s -X POST localhost:3000/api/items -H 'Content-Type: application/json' -d '{"title":"x"}'`
  - `curl -s localhost:3000/api/items` → JSON array

## Sandbox (preview) specifics

- Vite `allowedHosts` gets `.${BASE44_SANDBOX_HOST_DOMAIN}` appended only when
  `BASE44_PREVIEW_MODE === "1"`; the sandbox hostname rotates, so never hardcode it.
- The preview reaches the dev server as `Host: <port>-<sandbox id>.<domain>`, which
  must end with the allowed wildcard — a bare `3000-<domain>` host (no sandbox id)
  is correctly rejected.
- After a compose/service restart, refresh the preview; HMR covers normal edits.
