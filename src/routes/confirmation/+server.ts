import { postmarkClient } from '$lib/postmarkClient';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

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

const handler = async (req, res) => {
	const email = await postmarkClient.sendEmail({
		From: 'dakota@moon-watching.com',
		To: req.body.record.email,
		Subject: 'Your subscription to Moon Watching has been confirmed',
		HtmlBody: `<strong>Hello</strong> ${req.body.record.email}, thank you for subscribing to Moon Watching.`,
		MessageStream: 'transactional'
	});

	res.send({ message: 'Confirmation email sent' });
};

export default handler;
