import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import { postmarkClient } from '$lib/postmarkClient';
import type { RequestHandler } from './$types';
import { ALERT_KEY } from '$env/static/private';

export const POST = (async ({ request }) => {
	const REQUEST_KEY = request.headers.get('authorization');

	if (REQUEST_KEY !== `Bearer ${ALERT_KEY}`) {
		throw error(401, 'Not authorized');
	}

	const { phase, date, time, time_format } = await request.json();

	if (!phase || !date || !time || !time_format) {
		throw error(404, 'No moon data provided');
	}

	// Disabled for now, for testing
	// TODO: Format time in a less-error prone, easier-to-read way
	// That may require storing date and time together in UTC and converting it to PST at the edge
	// Using a native browser API to convert timezones
	// const unformattedTime = moonData.time.split(':');
	// const isPM = unformattedTime[0] > '12';
	// const hour = isPM ? unformattedTime[0] - 12 : unformattedTime[0];
	// const minute = unformattedTime[1];

	// // use parseInt to remove leading 0
	// const formattedTime = `${parseInt(hour)}:${minute} ${isPM ? 'PM' : 'AM'} ${moonData.time_format}`;

	// // Retrieve rendered html email
	// const emailRes = await fetch(
	// 	`/emails?templateName=MoonAlert&time=${formattedTime}&phase=${moonData.phase}`
	// );
	// const html = await emailRes.json();

	// if (!emailRes.ok) {
	// 	throw error(html.message);
	// }

	// // Retrieve list of subscribers
	// // Filter out subscribers who aren't active
	// const { data: subscribers, error: supabaseError } = await supabase
	// 	.from('subscribers')
	// 	.select('*');

	// if (supabaseError) {
	// 	throw error(404, supabaseError?.message ?? 'There was an error connecting to the database');
	// }

	// const emailSubject = `It's the ${moonData.phase}!`;

	// const subscriberMessages = subscribers.map((subscriber) => {
	// 	return {
	// 		From: 'dakota@moon-watching.com',
	// 		To: subscriber.email,
	// 		Subject: emailSubject,
	// 		HtmlBody: html,
	// 		MessageStream: 'broadcast'
	// 	};
	// });

	// try {
	// 	await postmarkClient.sendEmailBatch(subscriberMessages);
	// } catch (postmarkClientError: any) {
	// 	throw error(500, postmarkClientError ?? 'There was an error sending the email');
	// }

	return json('success');
}) satisfies RequestHandler;
