# Open Congress (Philippines)

**Live site: https://open-congress.vercel.app**
&nbsp;·&nbsp; API gateway: https://open-congress-api.vercel.app

A website for exploring Philippine legislative data (bills, senators, and representatives),
styled after BetterGov.ph. It reads from the public
[Open Congress API](https://open-congress-api.bettergov.ph).

This is an independent, non-official project. Data is public domain unless otherwise noted by
the source.

## Structure

- `api/` Rust gateway (Axum). Proxies the upstream Open Congress API and caches responses
  in memory. There is no database: requests are fetched live.
- `app/` SvelteKit 2 + Svelte 5 + Tailwind CSS v4 frontend. Talks to the `api/` gateway
  through server-side load functions.

## Running locally

Two processes. Start the API first.

### 1. API gateway (port 8080)

```
cargo run --manifest-path api/Cargo.toml
```

Environment variables (all optional):

- `BIND_ADDR` address to bind (default `127.0.0.1:8080`)
- `UPSTREAM_BASE` upstream base URL (default `https://open-congress-api.bettergov.ph/api`)
- `CACHE_TTL_SECS` in-memory response cache TTL in seconds (default `300`)

Responses are cached in-memory (moka) keyed by upstream URL; each response carries an
`x-cache: HIT|MISS` header. There is no database.

### 2. Frontend (port 5173)

```
pnpm --dir app run dev
```

Environment variable (optional):

- `API_BASE_URL` gateway base URL used by SvelteKit server loads (default `http://127.0.0.1:8080`)

Then open http://localhost:5173.

## Deployment

Both parts run on Vercel in the Singapore region (`sin1`).

| Part | URL | Notes |
| --- | --- | --- |
| App | https://open-congress.vercel.app | SvelteKit via `@sveltejs/adapter-vercel`, SSR retained |
| API | https://open-congress-api.vercel.app | Rust via `vercel_runtime` on the official Rust runtime |

The API reuses the same Axum router locally and on Vercel: `src/lib.rs` exposes `build_app()`,
which `src/main.rs` serves with a TCP listener and `api/axum.rs` wraps in `VercelLayer` for the
Vercel function. `vercel.json` rewrites every path to that single function.

Deploy either part with `vercel deploy --prod` from `api/` or `app/`. The app reads
`API_BASE_URL` (set in the Vercel project) to reach the gateway.

Note: `vercel_runtime` is declared under `[target.'cfg(unix)'.dependencies]` because version
2.4.0 does not compile on Windows (it uses `std::env` behind a `#[cfg(unix)]` import). Local
Windows development builds the lib and the `governance-api` binary; the `axum` binary is built
on Vercel's Linux images.

## API gateway routes

All routes return the upstream JSON envelope (`{ success, data, pagination? }`).

- `GET /health`
- `GET /api/stats`
- `GET /api/congresses`, `/api/congresses/{id}`, `/api/congresses/{id}/documents`
- `GET /api/people`, `/api/people/{id}`, `/api/people/{id}/groups`, `/api/people/{id}/documents`
- `GET /api/search/people?q=`
- `GET /api/documents`, `/api/documents/{id}`, `/api/documents/{id}/authors`
- `GET /api/search/documents?q=`

All routes forward query parameters upstream, so filters like `congress`, `type`, `scope`,
`author_id`, `date_from` / `date_to`, `search`, `sort` / `dir`, `limit` / `offset` work as
documented by the upstream API.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, project layout,
conventions, and the checks to run before opening a pull request.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE).

Data comes from the Open Congress API by BetterGov.ph and is public domain unless otherwise
noted by the source. This project is independent and not affiliated with any government agency.
