import type { PageServerLoad } from './$types';
import { congress } from '$lib/server/congress';
import { peopleSorts, resolveSort } from '$lib/congress/sort';

const LIMIT = 24;

export const load: PageServerLoad = async ({ fetch, url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const type = url.searchParams.get('type') ?? '';
	const congressFilter = url.searchParams.get('congress') ?? '';
	const sort = url.searchParams.get('sort') ?? '';
	const offset = Number(url.searchParams.get('offset') ?? '0') || 0;

	const resolved = resolveSort(peopleSorts, sort);

	const result = congress
		.people(fetch, {
			search: q,
			type,
			congress: congressFilter,
			sort: resolved.sort,
			dir: resolved.dir,
			limit: LIMIT,
			offset
		})
		.then((response) => ({ people: response.data, pagination: response.pagination }))
		.catch(() => ({ people: [], pagination: undefined }));

	const congresses = await congress
		.congresses(fetch, { limit: 50 })
		.then((response) => response.data)
		.catch(() => []);

	return { q, type, congress: congressFilter, sort, limit: LIMIT, offset, result, congresses };
};
