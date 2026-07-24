use std::env;

pub struct Config {
    pub bind: String,
    pub upstream: String,
    pub cache_ttl_secs: u64,
}

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
        }
    }
}
