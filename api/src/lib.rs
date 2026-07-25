mod config;
mod error;
mod routes;
mod state;
mod upstream;

use axum::Router;
use axum::http::{HeaderValue, Method};
use tower_http::cors::{AllowOrigin, Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

use crate::config::Config;
use crate::state::AppState;

pub fn init_tracing() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "governance_api=info,tower_http=info".into()),
        )
        .try_init();
}

/// `ALLOWED_ORIGINS="*"` opens the API to any origin; otherwise only the listed
/// origins may call it from a browser.
fn allowed_origins(origins: &[String]) -> AllowOrigin {
    if origins.iter().any(|origin| origin == "*") {
        return AllowOrigin::from(Any);
    }

    let list: Vec<HeaderValue> = origins
        .iter()
        .filter_map(|origin| match origin.parse::<HeaderValue>() {
            Ok(value) => Some(value),
            Err(_) => {
                tracing::warn!(%origin, "ignoring invalid entry in ALLOWED_ORIGINS");
                None
            }
        })
        .collect();

    AllowOrigin::list(list)
}

pub fn build_app() -> anyhow::Result<Router> {
    let config = Config::from_env();
    let state = AppState::new(config.upstream.clone(), config.cache_ttl_secs)?;

    let cors = CorsLayer::new()
        .allow_methods([Method::GET])
        .allow_origin(allowed_origins(&config.allowed_origins));

    Ok(routes::router(state)
        .layer(cors)
        .layer(TraceLayer::new_for_http()))
}

pub async fn run() -> anyhow::Result<()> {
    init_tracing();

    let config = Config::from_env();
    let app = build_app()?;

    let listener = tokio::net::TcpListener::bind(&config.bind).await?;
    tracing::info!(address = %config.bind, upstream = %config.upstream, "governance-api listening");
    axum::serve(listener, app).await?;

    Ok(())
}
