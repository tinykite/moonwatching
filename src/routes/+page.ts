import type { PageLoad } from './$types';
export const load = (async ({ fetch }) => {
	const res = await fetch(`/phases`);
	const moonPhase = await res.json();

	// const emailFetch = await fetch(`http://127.0.0.1:5173/email`, {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	},
	// 	body: JSON.stringify({
	// 		email: 'dakota@tinykitelab.com'
	// 	})
	// });

	// const success = await emailFetch.json();

	// console.log(success);

	return { moonPhase };
}) satisfies PageLoad;
