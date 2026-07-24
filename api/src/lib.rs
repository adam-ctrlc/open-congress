mod config;
mod error;
mod routes;
mod state;
mod upstream;

use axum::http::Method;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

use crate::config::Config;
use crate::state::AppState;

pub async fn run() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "governance_api=info,tower_http=info".into()),
        )
        .init();

    let config = Config::from_env();
    let state = AppState::new(config.upstream.clone(), config.cache_ttl_secs)?;

    let cors = CorsLayer::new()
        .allow_methods([Method::GET])
        .allow_origin(Any);

    let app = routes::router(state)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let listener = tokio::net::TcpListener::bind(&config.bind).await?;
    tracing::info!(address = %config.bind, upstream = %config.upstream, "governance-api listening");
    axum::serve(listener, app).await?;

    Ok(())
}
