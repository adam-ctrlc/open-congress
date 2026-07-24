use axum::extract::{Path, RawQuery, State};
use axum::response::Response;

use crate::error::ApiError;
use crate::state::AppState;
use crate::upstream::forward;

pub async fn list(State(state): State<AppState>, RawQuery(query): RawQuery) -> Result<Response, ApiError> {
    forward(&state, "/congresses", query.as_deref()).await
}

pub async fn by_id(
    State(state): State<AppState>,
    Path(id): Path<String>,
    RawQuery(query): RawQuery,
) -> Result<Response, ApiError> {
    forward(&state, &format!("/congresses/{id}"), query.as_deref()).await
}

pub async fn documents(
    State(state): State<AppState>,
    Path(id): Path<String>,
    RawQuery(query): RawQuery,
) -> Result<Response, ApiError> {
    forward(&state, &format!("/congresses/{id}/documents"), query.as_deref()).await
}
