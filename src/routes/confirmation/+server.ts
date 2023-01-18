import { postmarkClient } from '$lib/postmarkClient';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// TODO: Fix Typescript Errors
export const POST = async ({ request }: RequestHandler) => {
	const { email } = await request.json();

	if (!email) {
		throw error(404, 'Email not sent');
	}

	try {
		await postmarkClient.sendEmail({
			From: 'dakota@moon-watching.com',
			To: email,
			Subject: 'Moon Watching Email Confirmation',
			HtmlBody: 'Your subscription is confirmed',
			MessageStream: 'outbound'
		});
	} catch (
		postmarkClientError: any // eslint-disable-line @typescript-eslint/no-explicit-any
		// TODO: properly type
	) {
		throw error(404, postmarkClientError);
	}

	return json('Email sent');
};
