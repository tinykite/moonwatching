import type { HandleFetch } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const handleFetch = (({ event, request, fetch }) => {
	if (request.url.startsWith('https://moon-watching.com/alerts')) {
		if (!event.request.headers.get('authorization')) {
			throw error(401, 'Not authorized');
		}
		request.headers.set('authorization', event.request.headers.get('authorization') ?? '');
	}

	return fetch(request);
}) satisfies HandleFetch;
