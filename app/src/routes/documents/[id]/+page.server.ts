import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { congress } from '$lib/server/congress';

export const load: PageServerLoad = async ({ fetch, params }) => {
	try {
		const document = await congress.document(fetch, params.id);

		const authors = congress
			.documentAuthors(fetch, params.id)
			.then((response) => response.data)
			.catch(() => []);

		return {
			document: document.data,
			authors
		};
	} catch {
		error(404, 'Bill not found');
	}
};
