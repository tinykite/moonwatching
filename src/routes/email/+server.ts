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
