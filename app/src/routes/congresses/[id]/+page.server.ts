import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { congress } from '$lib/server/congress';
import { documentSorts, resolveSort } from '$lib/congress/sort';
import { readPage, toOffset } from '$lib/congress/pagination';

const LIMIT = 20;

export const load: PageServerLoad = async ({ fetch, params, url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const sort = url.searchParams.get('sort') ?? '';
	const page = readPage(url);
	const offset = toOffset(page, LIMIT);

	let detail;
	try {
		detail = await congress.congressById(fetch, params.id);
	} catch {
		error(404, 'Congress not found');
	}

	const resolved = resolveSort(documentSorts, sort);
	const base = {
		congress: detail.data.congress_number,
		limit: LIMIT,
		offset,
		sort: resolved.sort,
		dir: resolved.dir
	};

	const documents = (
		q ? congress.searchDocuments(fetch, { q, ...base }) : congress.documents(fetch, base)
	)
		.then((response) => ({ data: response.data, pagination: response.pagination }))
		.catch(() => ({ data: [], pagination: undefined }));

	return { congress: detail.data, q, sort, page, limit: LIMIT, documents };
};
