use std::env;

pub struct Config {
    pub bind: String,
    pub upstream: String,
    pub cache_ttl_secs: u64,
    pub allowed_origins: Vec<String>,
}

const DEFAULT_ORIGINS: &str = "https://open-congress.vercel.app,http://localhost:5173";

impl Config {
    pub fn from_env() -> Self {
        Self {
            bind: env::var("BIND_ADDR").unwrap_or_else(|_| "127.0.0.1:8080".into()),
            upstream: env::var("UPSTREAM_BASE")
                .unwrap_or_else(|_| "https://open-congress-api.bettergov.ph/api".into()),
            cache_ttl_secs: env::var("CACHE_TTL_SECS")
                .ok()
                .and_then(|value| value.parse().ok())
                .unwrap_or(300),
            allowed_origins: env::var("ALLOWED_ORIGINS")
                .unwrap_or_else(|_| DEFAULT_ORIGINS.into())
                .split(',')
                .map(str::trim)
                .filter(|origin| !origin.is_empty())
                .map(str::to_owned)
                .collect(),
        }
    }
}
