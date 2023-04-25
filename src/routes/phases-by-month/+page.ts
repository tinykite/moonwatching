import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch }) => {
	const res = await fetch(`/api/dynamicPhases?month=true`);
	const moonPhases = await res.json();

	if (res.ok) {
		return { moonPhases };
	} else throw error(404, moonPhases.message);
}) satisfies PageLoad;
