use axum::extract::State;
use axum::response::Response;

use crate::error::ApiError;
use crate::state::AppState;
use crate::upstream::forward;

pub async fn stats(State(state): State<AppState>) -> Result<Response, ApiError> {
    forward(&state, "/stats", None).await
}
