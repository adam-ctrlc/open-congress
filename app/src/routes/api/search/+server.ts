import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { congress } from '$lib/server/congress';

const LIMIT = 5;

export const GET: RequestHandler = async ({ fetch, url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';

	if (q.length < 2) {
		return json({ people: [], documents: [], peopleTotal: 0, documentsTotal: 0 });
	}

	const [people, documents] = await Promise.all([
		congress
			.people(fetch, { search: q, limit: LIMIT, sort: 'last_name', dir: 'asc' })
			.then((response) => ({
				data: response.data,
				total: response.pagination?.total ?? response.data.length
			}))
			.catch(() => ({ data: [], total: 0 })),
		congress
			.documents(fetch, { search: q, limit: LIMIT })
			.then((response) => ({
				data: response.data,
				total: response.pagination?.total ?? response.data.length
			}))
			.catch(() => ({ data: [], total: 0 }))
	]);

	return json({
		people: people.data,
		peopleTotal: people.total,
		documents: documents.data,
		documentsTotal: documents.total
	});
};
