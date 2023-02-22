import { postmarkClient } from '$lib/postmarkClient';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CONFIRMATION_KEY } from '$env/static/private';

export const POST = (async ({ request, fetch }) => {
	const REQUEST_KEY = request.headers.get('authorization');

	if (REQUEST_KEY !== `Bearer ${CONFIRMATION_KEY}`) {
		throw error(401, 'Not authorized');
	}

	const { email } = await request.json();

	if (!email) {
		throw error(404, 'No email provided');
	}

	// Retrieve rendered html email
	const emailRes = await fetch('/emails?templateName=Confirmation');
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
	} catch (postmarkClientError) {
		const errorMessage =
			postmarkClientError instanceof Error
				? postmarkClientError
				: 'Sorry, an error occurred. Your subscription could be not confirmed.';
		throw error(500, errorMessage);
	}

	return json('Email sent');
}) satisfies RequestHandler;
