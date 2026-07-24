mod congresses;
mod documents;
mod people;
mod stats;

use axum::Json;
use axum::Router;
use axum::routing::get;
use serde_json::{Value, json};

use crate::state::AppState;

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/api/stats", get(stats::stats))
        .route("/api/congresses", get(congresses::list))
        .route("/api/congresses/{id}", get(congresses::by_id))
        .route("/api/congresses/{id}/documents", get(congresses::documents))
        .route("/api/people", get(people::list))
        .route("/api/people/{id}", get(people::by_id))
        .route("/api/people/{id}/groups", get(people::groups))
        .route("/api/people/{id}/documents", get(people::documents))
        .route("/api/search/people", get(people::search))
        .route("/api/documents", get(documents::list))
        .route("/api/documents/{id}", get(documents::by_id))
        .route("/api/documents/{id}/authors", get(documents::authors))
        .route("/api/search/documents", get(documents::search))
        .with_state(state)
}

async fn health() -> Json<Value> {
    Json(json!({ "success": true, "data": { "status": "ok" } }))
}
