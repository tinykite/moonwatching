import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
export const load = (async () => {
	// const res = await fetch(`/phases`);
	// const moonPhase = await res.json();

	// if (res.ok) {
	// 	return { moonPhase };
	// } else throw error(404, moonPhase.message);
	return { moonPhase: 'Full Moon' };
}) satisfies PageLoad;
