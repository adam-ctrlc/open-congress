import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { congress } from '$lib/server/congress';

export const load: PageServerLoad = async ({ fetch }) => {
	const congresses = await congress
		.congresses(fetch, { limit: 50, include_stats: 'true' })
		.then((response) => response.data)
		.catch(() => []);

	const current = congresses.find((item) => item.end_date === null) ?? congresses[0];

	if (!current) {
		error(503, 'Congress data is unavailable');
	}

	const senators = congress
		.people(fetch, {
			type: 'senator',
			congress: current.congress_number,
			sort: 'last_name',
			dir: 'asc',
			limit: 100
		})
		.then((response) => ({
			data: response.data,
			total: response.pagination?.total ?? response.data.length
		}))
		.catch(() => ({ data: [], total: 0 }));

	return { current, senators };
};
