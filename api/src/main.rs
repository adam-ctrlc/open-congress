#[tokio::main]
async fn main() -> anyhow::Result<()> {
    governance_api::run().await
}
