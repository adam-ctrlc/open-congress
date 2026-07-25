import type { PageServerLoad } from './$types';
import { congress } from '$lib/server/congress';
import { documentSorts, resolveSort } from '$lib/congress/sort';
import { readPage, toOffset } from '$lib/congress/pagination';

const LIMIT = 20;

export const load: PageServerLoad = async ({ fetch, url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const congressFilter = url.searchParams.get('congress') ?? '';
	const type = url.searchParams.get('type') ?? '';
	const scope = url.searchParams.get('scope') ?? '';
	const dateFrom = url.searchParams.get('date_from') ?? '';
	const dateTo = url.searchParams.get('date_to') ?? '';
	const sort = url.searchParams.get('sort') ?? '';
	const page = readPage(url);
	const offset = toOffset(page, LIMIT);

	const resolved = resolveSort(documentSorts, sort);

	const result = congress
		.documents(fetch, {
			search: q,
			congress: congressFilter,
			type,
			scope,
			date_from: dateFrom,
			date_to: dateTo,
			sort: resolved.sort,
			dir: resolved.dir,
			limit: LIMIT,
			offset
		})
		.then((response) => ({ documents: response.data, pagination: response.pagination }))
		.catch(() => ({ documents: [], pagination: undefined }));

	const congresses = await congress
		.congresses(fetch, { limit: 50 })
		.then((response) => response.data)
		.catch(() => []);

	return {
		q,
		sort,
		congress: congressFilter,
		type,
		scope,
		dateFrom,
		dateTo,
		limit: LIMIT,
		page,
		result,
		congresses
	};
};
