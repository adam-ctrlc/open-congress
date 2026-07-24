import type { PageServerLoad } from './$types';
import { congress } from '$lib/server/congress';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await congress.congresses(fetch, { limit: 50, include_stats: 'true' });
	return { congresses: response.data };
};
