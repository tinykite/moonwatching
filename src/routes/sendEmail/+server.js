import { postmarkClient } from '$lib/postmarkClient';

// require('dotenv').config()
// const { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_URL, FROM_EMAIL_ADDRESS, CONTACT_TO_EMAIL_ADDRESS } = process.env
// const mailgun = require('mailgun-js')({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN, url: MAILGUN_URL })

// exports.handler = async (event) => {
//   if (event.httpMethod !== 'POST') {
//     return { statusCode: 405, body: 'Method Not Allowed', headers: { 'Allow': 'POST' } }
//   }

//   const data = JSON.parse(event.body)
//   if (!data.message || !data.contactName || !data.contactEmail) {
//     return { statusCode: 422, body: 'Name, email, and message are required.' }
//   }

//   const mailgunData = {
//     from: FROM_EMAIL_ADDRESS,
//     to: CONTACT_TO_EMAIL_ADDRESS,
//     'h:Reply-To': data.contactEmail,
//     subject: `New contact from $`,
//     text: `Name: $\nEmail: $\nMessage: $

//   return mailgun.messages().send(mailgunData).then(() => ({
//     statusCode: 200,
//     body: "Your message was sent successfully! We'll be in touch."
//   })).catch(error => ({
//     statusCode: 422,
//     body: `Error: $
//   ))
// }
// const sendGridMail = require("@sendgrid/mail");

// const handler = async (event) => {
//   try {
//     const { name, email, message } = JSON.parse(event.body).payload.data;

//     console.log(`name: ${name}, email: ${email}, message: ${message}`);

//     sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
//     const html = `
//       <div>
//          Hi ${name}! <br><br>
//          Thanks for getting in touch.
//          We have received your message
//          and one of our customer care
//          representatives will get in
//          touch shortly
//          <br><br>
//          Best <br>
//          John Doe
//       </div>
//     `;
//     const mail = {
//       from: process.env.SENDER_EMAIL,
//       to: email,
//       subject: "We have received your message",
//       html,
//     };
//     await sendGridMail.send(mail);
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: "Email sent" }),
//     };
//   } catch (error) {
//     return { statusCode: 422, body: String(error) };
//   }
// };

// module.exports = { handler };

// https://www.jennapederson.com/blog/2019/11/4/sending-email-with-netlify-functions/
// https://css-tricks.com/netlify-functions-for-sending-emails/

//gist.github.com/mmintel/5010673b570d2db3047b29f147c58482

export async function SendEmail() {
	// postmarkClient.sendEmail({
	// 	From: 'dakota@tinykitelab.com',
	// 	To: 'dakota@tinykitelab.com',
	// 	Subject: 'Hello from Postmark',
	// 	HtmlBody: '<strong>Hello</strong> here is another test.',
	// 	MessageStream: 'broadcast'
	// });
	//     await sendGridMail.send(mail);
	//     return {
	//       statusCode: 200,
	//       body: JSON.stringify({ message: "Email sent" }),
	//     };
	//   } catch (error) {
	//     return { statusCode: 422, body: String(error) };
	//   }

	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Hello, world' })
	};
}
