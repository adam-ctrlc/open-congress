/**
 * Pages are 1-based in URLs (`?page=2`); the upstream API takes a row offset.
 * Anything missing, non-numeric, or below 1 falls back to the first page.
 */
export function readPage(url: URL): number {
	const raw = Number(url.searchParams.get('page'));
	return Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;
}

export function toOffset(page: number, limit: number): number {
	return (page - 1) * limit;
}
