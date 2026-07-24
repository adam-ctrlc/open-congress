import type { PageServerLoad } from './$types';
import { congress } from '$lib/server/congress';
import type { Stats } from '$lib/congress/types';

export const load: PageServerLoad = async ({ fetch }) => {
	let stats: Stats | null = null;

	try {
		const response = await congress.stats(fetch);
		stats = response.data;
	} catch {
		stats = null;
	}

	return { stats };
};
