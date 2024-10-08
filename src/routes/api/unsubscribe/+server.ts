// import { json, error } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';
// import { supabasePrivate } from '$lib/supabaseClientPrivate';

// export const POST: RequestHandler = async ({ request }) => {
// 	const postmarkData = await request.json();

// 	if (!postmarkData) {
// 		throw error(404, 'Body not found');
// 	}

// 	const { error: supabaseError } = await supabasePrivate
// 		.from('subscribers')
// 		.update({ active: 'FALSE' })
// 		.eq('email', postmarkData.Recipient);

// 	if (supabaseError) {
// 		throw error(
// 			404,
// 			supabaseError?.message ?? 'There was an error updating the active status of this subscriber'
// 		);
// 	}

// 	return json('The active status of this subscriber has been successfully updated');
// };
