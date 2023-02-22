import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import { postmarkClient } from '$lib/postmarkClient';

// As per the HTML Specification
const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();
		const email = data.get('email') ?? '';
		const isValid = emailRegExp.test(email?.toString());

		if (!email) {
			return fail(422, {
				email,
				error: 'Your email is required'
			});
		}

		// Should be caught by the browser (based on type="email"), but just in case input type is removed
		if (!isValid) {
			return fail(422, {
				email,
				error: 'Your email is not valid'
			});
		}

		const { data: emailData } = await supabase
			.from('subscribers')
			.select('email')
			.eq('email', email);

		if (emailData?.length) {
			return fail(422, {
				email,
				error: 'You are already subscribed'
			});
		}

		const emailRes = await fetch('/emails?templateName=Confirmation');
		const html = await emailRes.json();

		if (!emailRes.ok) {
			return fail(500, {
				email,
				error: 'The email server could not be reached. Please try again later.'
			});
		}

		try {
			await postmarkClient.sendEmail({
				From: 'dakota@moon-watching.com',
				To: `${email}`,
				Subject: 'You are now subscribed to Moon Watching alerts',
				HtmlBody: html,
				MessageStream: 'outbound'
			});
		} catch (postmarkClientError) {
			const errorMessage =
				postmarkClientError instanceof Error
					? postmarkClientError
					: 'Sorry, an error occurred. Your subscription could be not confirmed.';
			return fail(500, { email, error: errorMessage });
		}

		const { error } = await supabase.from('subscribers').insert({ email });

		if (error) {
			return fail(500, {
				email,
				error: error.message
			});
		}

		return {
			success: 'Your email was successsfully subscribed!'
		};
	}
};
