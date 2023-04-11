import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
export const load = (async ({ fetch }) => {
	const date = new Date();
	// the value for months returned by the date API is zero-indexed
	const month = date.getMonth() + 1;

	const res = await fetch(`/dynamicPhases?month=${month}`);
	const moonPhases = await res.json();

	if (res.ok) {
		return { moonPhases };
	} else throw error(404, moonPhases.message);
}) satisfies PageLoad;
