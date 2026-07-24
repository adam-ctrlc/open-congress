# Contributing

Thanks for your interest in Open Congress. This is an independent, non-official project that
makes Philippine legislative data easier to explore.

## Prerequisites

- Rust (stable) for `api/`
- Node.js 20+ and pnpm for `app/`

## Getting started

Clone the repo, then start the API first so the frontend has data to read.

```
# Terminal 1: API gateway on http://127.0.0.1:8080
cargo run --manifest-path api/Cargo.toml

# Terminal 2: frontend on http://localhost:5173
pnpm --dir app install
pnpm --dir app run dev
```

Neither part needs credentials. The upstream Open Congress API is public and unauthenticated,
and there is no database.

## Project layout

- `api/src/` shared Axum code. `lib.rs` exposes `build_app()`, which returns the configured
  router. `main.rs` serves it locally; `api/api/axum.rs` wraps it for Vercel.
- `api/src/routes/` one module per resource (`people`, `documents`, `congresses`, `stats`).
- `app/src/lib/components/` reusable UI. `app/src/lib/congress/` types and formatting.
  `app/src/lib/server/congress.ts` is the only place that talks to the gateway.
- `app/src/routes/` pages. Data loading lives in `+page.server.ts` so it stays server-side.

## Conventions

- **Add routes in pairs.** A new gateway route in `api/src/routes/` needs a matching method in
  `app/src/lib/server/congress.ts`. Forward the query string with `RawQuery` so upstream filters
  keep working.
- **Filtering, sorting, and pagination are server-side.** Add options to
  `app/src/lib/congress/sort.ts` and pass them through as query params rather than filtering
  arrays in the browser.
- **Keep pages streaming.** Return promises from `+page.server.ts` and resolve them with
  `{#await}` plus a skeleton so the shell renders immediately.
- **Icons come from FontAwesome** via `svelte-fa`, re-exported from `app/src/lib/icons.ts`.
  Don't paste raw inline SVG for icons.
- **Charts** follow the palette in `BillsByCongressChart.svelte`: validated colors, a legend,
  hover tooltips, and a table fallback for accessibility.

## Checks

Run both before opening a pull request. They should report zero errors and zero warnings.

```
cargo check --manifest-path api/Cargo.toml --lib --bin governance-api
pnpm --dir app run check
```

### Windows note

`vercel_runtime` 2.4.0 does not compile on Windows: it uses `std::env` while importing it only
under `#[cfg(unix)]`. It is therefore declared under `[target.'cfg(unix)'.dependencies]`, so the
`axum` binary (the Vercel entrypoint) only builds on Linux and macOS. On Windows, build the lib
and the `governance-api` binary explicitly, as shown above, instead of `--all-targets`.

## Pull requests

- Keep changes focused, and describe what you changed and why.
- Match the surrounding code style; the projects use `rustfmt` and Prettier defaults.
- Mention any upstream API behaviour you relied on, ideally with the request you used to confirm
  it. Several upstream parameters are undocumented or loosely validated (for example
  `/documents?type=` expects `HB` or `SB` rather than `bill`), so evidence helps reviewers.

## Reporting issues

Include the URL or API request, what you expected, and what happened. If the problem is missing
or wrong data, please check the upstream
[Open Congress API](https://open-congress-api.bettergov.ph) first: this project renders that data
without modifying it, so gaps there show up here too.

## License

By contributing, you agree that your contributions are licensed under the
[Apache License 2.0](LICENSE).
