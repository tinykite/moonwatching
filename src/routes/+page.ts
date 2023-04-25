import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
export const load = (async ({ fetch }) => {
	const res = await fetch(`/api/dynamicPhase`);
	const moonPhase = await res.json();

	if (res.ok) {
		return { moonPhase };
	} else throw error(404, moonPhase.message);
}) satisfies PageLoad;
