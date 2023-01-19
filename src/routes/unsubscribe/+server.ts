import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const postmarkData = await request.json();

	if (!postmarkData) {
		throw error(404, 'Body not found');
	}

	return json(postmarkData);
};
