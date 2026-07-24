import type { PageServerLoad } from './$types';
import { congress } from '$lib/server/congress';

const PREVIEW = 6;

export const load: PageServerLoad = async ({ fetch, url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';

	if (!q) {
		return { q, people: { data: [], total: 0 }, documents: { data: [], total: 0 } };
	}

	const people = congress
		.searchPeople(fetch, { q, limit: PREVIEW })
		.then((response) => ({
			data: response.data,
			total: response.pagination?.total ?? response.data.length
		}))
		.catch(() => ({ data: [], total: 0 }));

	const documents = congress
		.searchDocuments(fetch, { q, limit: PREVIEW })
		.then((response) => ({
			data: response.data,
			total: response.pagination?.total ?? response.data.length
		}))
		.catch(() => ({ data: [], total: 0 }));

	return { q, people, documents };
};
