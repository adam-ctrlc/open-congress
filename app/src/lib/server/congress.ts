import { env } from '$env/dynamic/private';
import type {
	Congress,
	DocumentSummary,
	Envelope,
	Group,
	Person,
	Stats
} from '$lib/congress/types';

const BASE = env.API_BASE_URL ?? 'http://127.0.0.1:8080';

type Fetch = typeof fetch;

const REQUEST_TIMEOUT_MS = 15000;

async function get<T>(fetch: Fetch, path: string): Promise<Envelope<T>> {
	const response = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
	const payload = (await response.json()) as Envelope<T>;

	if (!response.ok || payload.success === false) {
		const message = payload.error?.message ?? `Upstream returned ${response.status}`;
		throw new Error(message);
	}

	return payload;
}

export type QueryParams = Record<string, string | number | undefined | null>;

function buildQuery(params: QueryParams): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			search.set(key, String(value));
		}
	}
	const query = search.toString();
	return query ? `?${query}` : '';
}

export const congress = {
	stats: (fetch: Fetch) => get<Stats>(fetch, '/api/stats'),

	people: (fetch: Fetch, params: QueryParams) =>
		get<Person[]>(fetch, `/api/people${buildQuery(params)}`),

	searchPeople: (fetch: Fetch, params: QueryParams) =>
		get<Person[]>(fetch, `/api/search/people${buildQuery(params)}`),

	person: (fetch: Fetch, id: string, params: QueryParams = {}) =>
		get<Person>(fetch, `/api/people/${id}${buildQuery(params)}`),

	personGroups: (fetch: Fetch, id: string, params: QueryParams = {}) =>
		get<Group[]>(fetch, `/api/people/${id}/groups${buildQuery(params)}`),

	personDocuments: (fetch: Fetch, id: string, params: QueryParams) =>
		get<DocumentSummary[]>(fetch, `/api/people/${id}/documents${buildQuery(params)}`),

	documents: (fetch: Fetch, params: QueryParams) =>
		get<DocumentSummary[]>(fetch, `/api/documents${buildQuery(params)}`),

	searchDocuments: (fetch: Fetch, params: QueryParams) =>
		get<DocumentSummary[]>(fetch, `/api/search/documents${buildQuery(params)}`),

	document: (fetch: Fetch, id: string) => get<DocumentSummary>(fetch, `/api/documents/${id}`),

	documentAuthors: (fetch: Fetch, id: string) =>
		get<Person[]>(fetch, `/api/documents/${id}/authors`),

	congresses: (fetch: Fetch, params: QueryParams) =>
		get<Congress[]>(fetch, `/api/congresses${buildQuery(params)}`),

	congressById: (fetch: Fetch, id: string, params: QueryParams = {}) =>
		get<Congress>(fetch, `/api/congresses/${id}${buildQuery(params)}`),

	congressDocuments: (fetch: Fetch, id: string, params: QueryParams) =>
		get<DocumentSummary[]>(fetch, `/api/congresses/${id}/documents${buildQuery(params)}`)
};
