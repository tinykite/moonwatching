import { postmarkClient } from '$lib/postmarkClient';
import { json, error } from '@sveltejs/kit';

//   return mailgun.messages().send(mailgunData).then(() => ({
//     statusCode: 200,
//     body: "Your message was sent successfully! We'll be in touch."
//   })).catch(error => ({
//     statusCode: 422,
//     body: `Error: $
//   ))
// }

// module.exports = { handler };

// https://www.jennapederson.com/blog/2019/11/4/sending-email-with-netlify-functions/
// https://css-tricks.com/netlify-functions-for-sending-emails/

//gist.github.com/mmintel/5010673b570d2db3047b29f147c58482

export async function POST() {
	try {
		// await postmarkClient.sendEmail({
		// 	From: 'dakota@tinykitelab.com',
		// 	To: 'dakota@tinykitelab.com',
		// 	Subject: 'Test Email',
		// 	HtmlBody: '<strong>Hello</strong> here is another test.',
		// 	MessageStream: 'broadcast'
		// });
		return json('hello folks');
		// throw Error('Email not sent');
	} catch (errorMessage) {
		throw error(404, {
			message: errorMessage,
			code: 'NOT_FOUND'
		});
	}
}
