use axum::Json;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use serde_json::json;

pub struct ApiError(anyhow::Error);

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        tracing::error!(error = ?self.0, "request failed");
        let body = Json(json!({
            "success": false,
            "error": {
                "code": "UPSTREAM_ERROR",
                "message": self.0.to_string(),
            }
        }));
        (StatusCode::BAD_GATEWAY, body).into_response()
    }
}

impl<E> From<E> for ApiError
where
    E: Into<anyhow::Error>,
{
    fn from(error: E) -> Self {
        Self(error.into())
    }
}
