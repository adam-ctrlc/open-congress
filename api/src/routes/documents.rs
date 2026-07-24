use axum::extract::{Path, RawQuery, State};
use axum::response::Response;

use crate::error::ApiError;
use crate::state::AppState;
use crate::upstream::forward;

pub async fn list(State(state): State<AppState>, RawQuery(query): RawQuery) -> Result<Response, ApiError> {
    forward(&state, "/documents", query.as_deref()).await
}

pub async fn by_id(
    State(state): State<AppState>,
    Path(id): Path<String>,
    RawQuery(query): RawQuery,
) -> Result<Response, ApiError> {
    forward(&state, &format!("/documents/{id}"), query.as_deref()).await
}

pub async fn authors(
    State(state): State<AppState>,
    Path(id): Path<String>,
    RawQuery(query): RawQuery,
) -> Result<Response, ApiError> {
    forward(&state, &format!("/documents/{id}/authors"), query.as_deref()).await
}

pub async fn search(State(state): State<AppState>, RawQuery(query): RawQuery) -> Result<Response, ApiError> {
    forward(&state, "/search/documents", query.as_deref()).await
}
