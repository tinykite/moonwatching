import type { PageLoad } from './$types';
export const load = (async ({ fetch }) => {
	// const date = new Date();
	const res = await fetch(`/getPhase`);
	const moonPhase = await res.json();

	const response = await fetch(`/emails`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			subscriberName: 'Dakota'
		})
	});

	return { moonPhase };
}) satisfies PageLoad;
