import { postmarkClient } from '$lib/postmarkClient';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({ request, fetch }) => {
	const { email } = await request.json();

	if (!email) {
		throw error(404, 'No email provided');
	}

	// Retrieve rendered html email
	// TODO: Decide if there's a better way to handle the fact that Confirmation refers to a React component
	// So it needs to be capitalized as a parameter in the API route
	const emailRes = await fetch('/emails/Confirmation');
	const html = await emailRes.json();

	if (!emailRes.ok) {
		throw error(404, html.message);
	}

	try {
		await postmarkClient.sendEmail({
			From: 'dakota@moon-watching.com',
			To: email,
			Subject: 'You are now subscribed to Moon Watching alerts',
			HtmlBody: html,
			MessageStream: 'outbound'
		});
	} catch (
		postmarkClientError: any // eslint-disable-line @typescript-eslint/no-explicit-any
		// TODO: properly type
	) {
		throw error(404, postmarkClientError);
	}

	return json('Email sent');
}) satisfies RequestHandler;
