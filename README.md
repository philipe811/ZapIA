# ZapIA

Starter fullstack app scaffolded in this repository:

- **`frontend/`** — React 19 + Vite dev server (published on host port **3000**)
- **`backend/`** — FastAPI + SQLite (port **8000**, docs at `/docs`)

The frontend talks to the API through a Vite proxy on `/api`, so the browser only
ever sees one origin (port 3000) and no CORS setup is required.

## Run it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- App: <http://localhost:3000>
- API health: <http://localhost:3000/api/health>
- API docs: <http://localhost:8000/docs>

Both services run from the bind-mounted source with live reload (Vite HMR for the
frontend, `uvicorn --reload` for the API). Dependencies are installed into named
volumes on container start, so editing `package.json` or `requirements.txt` only
needs a restart:

```bash
docker compose -f docker-compose.base44.yml restart web api
```

## Layout

```
backend/app/main.py   FastAPI routes (/api/health, /api/items)
backend/app/db.py     SQLite access + schema creation
frontend/src/App.jsx  Item board UI
frontend/src/api.js   fetch helpers for the API
docker-compose.base44.yml  Development stack (live reload)
```

## Data

Items are stored in SQLite at `/data/app.db` inside the `api_data` volume, so they
survive container restarts. The schema is created on API startup (`db.init_db()`);
there is no migration tool yet — add one (e.g. Alembic) before evolving the schema
in real deployments.

## Sandbox / preview notes

- The Vite dev server binds `0.0.0.0` and, only when `BASE44_PREVIEW_MODE=1`,
  extends `server.allowedHosts` with `.<BASE44_SANDBOX_HOST_DOMAIN>` (the sandbox
  hostname rotates). With the flag unset, `vite.config.js` allows only localhost.
- `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed through from the platform.
- `BASE44_PREVIEW_MODE` and `BASE44_SANDBOX_HOST_DOMAIN` are passed into the `web`
  service by Compose and never hardcoded in code or config.

## Not included yet

No automated test suite, linting, or CI config — add these as the app grows.
