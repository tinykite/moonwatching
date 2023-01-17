import type { PageLoad } from './$types';
export const load = (async ({ fetch }) => {
	const res = await fetch(`/phases`);
	const moonPhase = await res.json();

	return { moonPhase };
}) satisfies PageLoad;
