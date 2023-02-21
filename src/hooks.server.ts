import type { HandleFetch } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const handleFetch = (({ event, request, fetch }) => {
	if (request.url.startsWith('/alerts')) {
		if (!event.request.headers.get('authorization')) {
			throw error(401, 'Not authorized');
		}
		const auth = event.request.headers.get('authorization');

		if (!auth) {
			throw error(401, 'Cannot forward authorization header');
		}

		request.headers.set('authorization', auth);
	}

	return fetch(request);
}) satisfies HandleFetch;
