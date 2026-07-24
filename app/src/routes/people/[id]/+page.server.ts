import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { congress } from '$lib/server/congress';
import { documentSorts, resolveSort } from '$lib/congress/sort';

const LIMIT = 20;

export const load: PageServerLoad = async ({ fetch, params, url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const sort = url.searchParams.get('sort') ?? '';
	const offset = Number(url.searchParams.get('offset') ?? '0') || 0;

	try {
		const [person, groups] = await Promise.all([
			congress.person(fetch, params.id),
			congress.personGroups(fetch, params.id)
		]);

		const resolved = resolveSort(documentSorts, sort);
		const documents = congress
			.documents(fetch, {
				author_id: params.id,
				search: q,
				sort: resolved.sort,
				dir: resolved.dir,
				limit: LIMIT,
				offset
			})
			.then((response) => ({ data: response.data, pagination: response.pagination }))
			.catch(() => ({ data: [], pagination: undefined }));

		return {
			person: person.data,
			groups: groups.data,
			documents,
			q,
			sort,
			limit: LIMIT,
			offset
		};
	} catch {
		error(404, 'Legislator not found');
	}
};
