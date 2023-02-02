import type { PageLoad } from '../$types';
import { error } from '@sveltejs/kit';
export const load = (async ({ fetch, params }) => {
	const { templateName } = params;

	const res = await fetch(`/emails/${templateName}`);
	const email = await res.json();

	if (res.ok) {
		return { email };
	} else throw error(404, email.message);
}) satisfies PageLoad;
