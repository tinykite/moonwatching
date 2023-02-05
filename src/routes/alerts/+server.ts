import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import { postmarkClient } from '$lib/postmarkClient';
import type { RequestHandler } from './$types';

export const POST = (async () => {
	const res = await fetch('https://moon-watching.com/phases?details=true');
	const moonData = await res.json();

	if (!res.ok) {
		throw error(404, 'Moon phase could not be fetched');
	}

	// TODO: Format time in a less-error prone, easier-to-read way
	// That may require storing date and time together in UTC and converting it to PST at the edge
	// Using a native browser API to convert timezones
	const unformattedTime = moonData.time.split(':');
	const isPM = unformattedTime[0] > '12';
	const hour = isPM ? unformattedTime[0] - 12 : unformattedTime[0];
	const minute = unformattedTime[1];

	// use parseInt to remove leading 0
	const formattedTime = `${parseInt(hour)}:${minute} ${isPM ? 'PM' : 'AM'} ${moonData.time_format}`;

	// Retrieve rendered html email
	// TODO: Decide if there's a better way to handle the capitalized name of React email templates
	const emailRes = await fetch(
		`https://moon-watching.com/emails?templateName=MoonAlert&time=${formattedTime}&phase=${moonData.phase}`
	);
	const html = await emailRes.json();

	if (!emailRes.ok) {
		throw error(html.message);
	}

	// Retrieve list of subscribers
	// Filter out subscribers who aren't active
	const { data: subscribers, error: supabaseError } = await supabase
		.from('subscribers')
		.select('*');

	if (supabaseError) {
		throw error(404, supabaseError?.message ?? 'There was an error connecting to the database');
	}

	const emailSubject = `It's the ${moonData.phase}!`;

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

	return json('Emails sent');
}) satisfies RequestHandler;
