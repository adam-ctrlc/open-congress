use std::time::Duration;

use bytes::Bytes;
use moka::future::Cache;

pub type CachedResponse = (u16, Bytes);

#[derive(Clone)]
pub struct AppState {
    pub http: reqwest::Client,
    pub upstream: String,
    pub cache: Cache<String, CachedResponse>,
}

impl AppState {
    pub fn new(upstream: String, cache_ttl_secs: u64) -> anyhow::Result<Self> {
        let http = reqwest::Client::builder()
            .user_agent(concat!("governance-api/", env!("CARGO_PKG_VERSION")))
            .timeout(Duration::from_secs(20))
            .build()?;

        let cache = Cache::builder()
            .max_capacity(10_000)
            .time_to_live(Duration::from_secs(cache_ttl_secs))
            .build();

        Ok(Self {
            http,
            upstream,
            cache,
        })
    }
}
