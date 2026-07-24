mod config;
mod error;
mod routes;
mod state;
mod upstream;

use axum::Router;
use axum::http::Method;
use tower_http::cors::{Any, CorsLayer};
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

pub fn build_app() -> anyhow::Result<Router> {
    let config = Config::from_env();
    let state = AppState::new(config.upstream.clone(), config.cache_ttl_secs)?;

    let cors = CorsLayer::new()
        .allow_methods([Method::GET])
        .allow_origin(Any);

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
