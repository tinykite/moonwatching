// import { postmarkClient } from '$lib/postmarkClient';
// import { supabasePrivate } from '$lib/supabaseClient';
// import { json, error } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';

// export const POST = (async ({ request, fetch }) => {
// 	// const { phase } = await request.json();

// 	// if (!phase) {
// 	// 	throw error(404, 'No moon phase provided');
// 	// }

// 	// const { phase } = moonData;
// 	// const template = phase === 'Full Moon' ? 'FullMoon' : 'NewMoon';

// 	// // Retrieve rendered html email
// 	// // TODO: Decide if there's a better way to handle the capitalized name of React email templates
// 	// const emailRes = await fetch(`/emails/${template}`);
// 	// const html = await emailRes.json();

// 	// if (!emailRes.ok) {
// 	// 	throw error(404, html.message);
// 	// }

// 	// // Retrieve list of subscribers
// 	// // Filter out subscribers who aren't active
// 	// const { data: subscribers, error: supabaseError } = await supabasePrivate
// 	// 	.from('subscribers')
// 	// 	.select('*')
// 	// 	.eq('email', 'dakota@tinykitelab.com');

// 	// if (supabaseError) {
// 	// 	throw error(404, supabaseError?.message ?? 'There was an error connecting to the database');
// 	// }

// 	// // Postmark requires a comma-separated list of email messages
// 	// const subscriberList = subscribers.map((subscriber) => {
// 	// 	return {
// 	// 		From: 'dakota@tinykitelab.com',
// 	// 		To: subscriber.email,
// 	// 		Subject: `Today's the Full Moon!`,
// 	// 		HtmlBody: 'yes',
// 	// 		MessageStream: 'outbound'
// 	// 	};
// 	// });

// 	// console.log(subscriberList);

// 	// try {
// 	// } catch (
// 	// 	postmarkClientError: any // eslint-disable-line @typescript-eslint/no-explicit-any
// 	// 	// TODO: properly type
// 	// ) {
// 	// 	throw error(404, postmarkClientError);
// 	// }

// 	// try {
// 	// 	await postmarkClient.sendEmail({
// 	// 		From: 'dakota@moon-watching.com',
// 	// 		To: 'dakota@tinykitelab.com, dakota+12@tinykitelab.com',
// 	// 		Subject: 'You are now subscribed to Moon Watching alerts',
// 	// 		HtmlBody: html,
// 	// 		MessageStream: 'outbound'
// 	// 	});
// 	// } catch (
// 	// 	postmarkClientError: any // eslint-disable-line @typescript-eslint/no-explicit-any
// 	// 	// TODO: properly type
// 	// ) {
// 	// 	throw error(404, postmarkClientError);
// 	// }

// 	return json(200, 'Broadcast sent');
// }) satisfies RequestHandler;
