import { postmarkClient } from '$lib/postmarkClient';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// import { postmarkClient } from '$lib/postmarkClient';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// export async function POST(event: any) {
// 	console.log(event.body);
// 	try {
// 		// await postmarkClient.sendEmail({
// 		// 	From: 'dakota@tinykitelab.com',
// 		// 	To: 'dakota@tinykitelab.com',
// 		// 	Subject: 'Test Email',
// 		// 	HtmlBody: '<strong>Hello</strong> here is another test.',
// 		// 	MessageStream: 'broadcast'
// 		// });
// 		// return json('hello folks');
// 		// throw Error('Email not sent');

// 		return json('Email sent');
// 	} catch (
// 		postmarkClientError: any // eslint-disable-line @typescript-eslint/no-explicit-any
// 		// TODO: properly type
// 	) {
// 		// throw error(404, {
// 		// 	message: postmarkClientError
// 		// });

// 		throw error(404, postmarkClientError);
// 	}
// }

export const POST: RequestHandler = async ({ request }) => {
	const emailBody = request.body;

	if (!emailBody) {
		throw error(404, 'Email not sent');
	}

	console.log(emailBody);

	// return {
	// 	status: 200,
	// 	headers: { 'Content-Type': 'application/json' },
	// 	body: {
	// 		message: 'Email sent'
	// 	}
	// };

	return json('Email sent');
};

// export const POST: RequestHandler = async ({ request }) => {
// 	if (!request.body) {
// 		throw error(404, 'Confirmation email not sent');
// 	}

// 	await request.body;
// 	console.log(request.body);

// 	// const { emailAddress } = await request.body;

// 	// const email = await postmarkClient.sendEmail({
// 	// 	From: 'dakota@moon-watching.com',
// 	// 	To: emailAddress,
// 	// 	Subject: 'Your subscription to Moon Watching has been confirmed',
// 	// 	HtmlBody: `<strong>Hello</strong>, thank you for subscribing to Moon Watching.`,
// 	// 	MessageStream: 'transactional'
// 	// });

// 	return json('Confirmation email sent');
// };

// export const POST: RequestHandler = async ({ request }) => {
// 	if (!request.body.record.email) {
// 		throw error(404, 'Confirmation email not sent');
// 	}

// 	const email = await postmarkClient.sendEmail({
// 		From: 'dakota@moon-watching.com',
// 		To: request.body.record.email,
// 		Subject: 'Your subscription to Moon Watching has been confirmed',
// 		HtmlBody: `<strong>Hello</strong> ${request.body.record.email}, thank you for subscribing to Moon Watching.`,
// 		MessageStream: 'transactional'
// 	});

// 	return json('Confirmation email sent');
// };

// const handler = async (req, res) => {
// 	const email = await postmarkClient.sendEmail({
// 		From: 'dakota@moon-watching.com',
// 		To: req.body.record.email,
// 		Subject: 'Your subscription to Moon Watching has been confirmed',
// 		HtmlBody: `<strong>Hello</strong> ${req.body.record.email}, thank you for subscribing to Moon Watching.`,
// 		MessageStream: 'transactional'
// 	});

// 	res.send({ message: 'Confirmation email sent' });
// };

// export default handler;
