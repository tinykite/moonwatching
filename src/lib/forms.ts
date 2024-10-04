// Moonwatching emails are not currently enabled
// import { fail } from '@sveltejs/kit';
// import { supabase } from '$lib/supabaseClient';
// import { postmarkClient } from '$lib/postmarkClient';
// import { emailRegExp } from '$lib/consts';
// import { getHashFromStringNode } from './crypto';

// const validateEmail = (email?: string) => {
// 	if (!email || typeof email !== 'string') {
// 		return false;
// 	}
// 	return emailRegExp.test(email.toLowerCase());
// };

// export const newsletterSignup = async ({ request, fetch }) => {
// 	const data = await request.formData();
// 	const email = data.get('email') ?? '';
// 	const uniqueHashIdentifier = getHashFromStringNode(email)

// 	if (!email) {
// 		return fail(422, {
// 			email,
// 			error: 'Your email is required'
// 		});
// 	}

// 	const isValid = validateEmail(email);

// 	// Should be caught by the browser (based on type="email"), but just in case input type is removed
// 	if (!isValid) {
// 		return fail(422, {
// 			email,
// 			error: 'Your email is not valid'
// 		});
// 	}

// 	const { data: emailData } = await supabase.from('subscribers').select('email').eq('email', email);

// 	if (emailData?.length) {
// 		return fail(422, {
// 			email,
// 			error: 'You are already subscribed'
// 		});
// 	}

// 	const emailRes = await fetch('/api/emails?templateName=Confirmation');
// 	const html = await emailRes.json();

// 	if (!emailRes.ok) {
// 		return fail(500, {
// 			email,
// 			error: 'The email server could not be reached. Please try again later.'
// 		});
// 	}

// 	try {
// 		await postmarkClient.sendEmail({
// 			From: 'info@moon-watching.com',
// 			To: `${email}`,
// 			Subject: 'You are now subscribed to Moon Watching alerts',
// 			HtmlBody: html,
// 			TextBody:
// 				'Thank you for subscribing! You will now receive updates on each upcoming New and Full Moon.',
// 			MessageStream: 'outbound'
// 		});
// 	} catch (postmarkClientError) {
// 		const errorMessage =
// 			postmarkClientError instanceof Error
// 				? postmarkClientError
// 				: 'Sorry, an error occurred. Your subscription could be not confirmed.';
// 		return fail(500, { email, error: errorMessage });
// 	}

// 	const { error } = await supabase.from('subscribers').insert({ email, active: true, subscription_hash: uniqueHashIdentifier });

// 	if (error) {
// 		return fail(500, {
// 			email,
// 			error: error.message
// 		});
// 	}

// 	return {
// 		success: 'Your email was successsfully subscribed!'
// 	};
// };

// export { validateEmail };
