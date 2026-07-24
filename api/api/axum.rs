use tower::ServiceBuilder;
use vercel_runtime::Error;
use vercel_runtime::axum::VercelLayer;

#[tokio::main]
async fn main() -> Result<(), Error> {
    governance_api::init_tracing();

    let app = ServiceBuilder::new()
        .layer(VercelLayer::new())
        .service(governance_api::build_app()?);

    vercel_runtime::run(app).await
}
