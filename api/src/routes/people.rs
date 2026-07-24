use axum::extract::{Path, RawQuery, State};
use axum::response::Response;

use crate::error::ApiError;
use crate::state::AppState;
use crate::upstream::forward;

pub async fn list(State(state): State<AppState>, RawQuery(query): RawQuery) -> Result<Response, ApiError> {
    forward(&state, "/people", query.as_deref()).await
}

pub async fn by_id(
    State(state): State<AppState>,
    Path(id): Path<String>,
    RawQuery(query): RawQuery,
) -> Result<Response, ApiError> {
    forward(&state, &format!("/people/{id}"), query.as_deref()).await
}

pub async fn groups(
    State(state): State<AppState>,
    Path(id): Path<String>,
    RawQuery(query): RawQuery,
) -> Result<Response, ApiError> {
    forward(&state, &format!("/people/{id}/groups"), query.as_deref()).await
}

pub async fn documents(
    State(state): State<AppState>,
    Path(id): Path<String>,
    RawQuery(query): RawQuery,
) -> Result<Response, ApiError> {
    forward(&state, &format!("/people/{id}/documents"), query.as_deref()).await
}

pub async fn search(State(state): State<AppState>, RawQuery(query): RawQuery) -> Result<Response, ApiError> {
    forward(&state, "/search/people", query.as_deref()).await
}
