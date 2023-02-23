import { json, error } from '@sveltejs/kit';
import { supabasePrivate } from '$lib/supabaseClient';
import { postmarkClient } from '$lib/postmarkClient';
import type { RequestHandler } from './$types';
import { ALERT_KEY } from '$env/static/private';

export const POST = (async ({ request, fetch }) => {
	const REQUEST_KEY = request.headers.get('authorization');

	if (REQUEST_KEY !== `Bearer ${ALERT_KEY}`) {
		throw error(401, 'Not authorized');
	}

	const { phase, date, time, time_format } = await request.json();

	if (!phase || !date || !time || !time_format) {
		throw error(422, 'Incomplete moon data provided');
	}

	const { data: pastAlerts } = await supabasePrivate.from('alerts').select('date').eq('date', date);

	// Make sure cron job doesn't send multiple alerts for the same day
	if (pastAlerts?.length) {
		throw error(500, 'Alert already sent');
	}

	// TODO: Format time in a less-error prone, easier-to-read way
	// That may require storing date and time together in UTC and converting it to PST at the edge
	// Using a native browser API to convert timezones
	const unformattedTime = time.split(':');
	const isPM = unformattedTime[0] > '12';
	const hour = isPM ? unformattedTime[0] - 12 : unformattedTime[0];
	const minute = unformattedTime[1];

	// // use parseInt to remove leading 0
	const formattedTime = `${parseInt(hour)}:${minute} ${isPM ? 'PM' : 'AM'} ${time_format}`;

	// Fetch list of subscribers
	// Commented-out for testing
	// const { data: subscribers, error: supabaseError } = await supabasePrivate
	// 	.from('subscribers')
	// 	.select('email')
	// 	.eq('active', true);

	const { data: subscribers, error: supabaseError } = await supabasePrivate
		.from('subscribers')
		.select('email')
		.eq('email', 'dakota@tinykitelab.com');

	if (supabaseError) {
		throw error(404, supabaseError?.message ?? 'There was an error connecting to the database');
	}

	// Retrieve rendered html email
	const emailRes = await fetch(
		`/emails?templateName=MoonAlert&time=${formattedTime}&phase=${phase}`
	);
	const html = await emailRes.json();

	if (!emailRes.ok) {
		throw error(html.message);
	}

	const emailSubject = `It's the ${phase}!`;

	const subscriberMessages = subscribers.map((subscriber) => {
		return {
			From: 'dakota@moon-watching.com',
			To: subscriber.email,
			Subject: emailSubject,
			HtmlBody: html,
			MessageStream: 'broadcast'
		};
	});

	try {
		await postmarkClient.sendEmailBatch(subscriberMessages);
	} catch (postmarkClientError: any) {
		throw error(500, postmarkClientError ?? 'There was an error sending the email');
	}

	// Insert alert into database
	const { error: insertError } = await supabasePrivate.from('alerts').insert({ date, phase });

	if (insertError) {
		throw error(
			500,
			insertError?.message ?? 'There was an error inserting the alert into the database'
		);
	}

	return json('Successfully sent moon alert');
}) satisfies RequestHandler;
