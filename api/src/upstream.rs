use axum::http::{StatusCode, header};
use axum::response::{IntoResponse, Response};
use bytes::Bytes;

use crate::error::ApiError;
use crate::state::AppState;

fn build_response(status: u16, body: Bytes, cache_state: &'static str) -> Response {
    let status = StatusCode::from_u16(status).unwrap_or(StatusCode::BAD_GATEWAY);
    (
        status,
        [
            (header::CONTENT_TYPE, "application/json"),
            (header::HeaderName::from_static("x-cache"), cache_state),
        ],
        body,
    )
        .into_response()
}

pub async fn forward(state: &AppState, path: &str, query: Option<&str>) -> Result<Response, ApiError> {
    let mut url = format!("{}{}", state.upstream, path);
    if let Some(q) = query {
        if !q.is_empty() {
            url.push('?');
            url.push_str(q);
        }
    }

    if let Some((status, body)) = state.cache.get(&url).await {
        return Ok(build_response(status, body, "HIT"));
    }

    let response = state.http.get(&url).send().await?;
    let status = response.status().as_u16();
    let body = response.bytes().await?;

    if (200..300).contains(&status) {
        state.cache.insert(url, (status, body.clone())).await;
    }

    Ok(build_response(status, body, "MISS"))
}
