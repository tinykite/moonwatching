import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import { PUBLIC_SERVER_PATH } from '$env/static/public';

// As per the HTML Specification
const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
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

		const { error } = await supabase.from('subscribers').insert({ email });

		// TODO: Rewrite this as a Supabase select
		if (error && error.message.includes('violates unique constraint "subscribers_email_key"')) {
			return fail(422, {
				email,
				error: 'Your email has already been submitted'
			});
		}

		if (error) {
			return fail(422, {
				email: data.get('email'),
				error: error.message
			});
		}

		const confirmationEmail = await fetch(`${PUBLIC_SERVER_PATH}/confirmation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email
			})
		});

		const emailRes = await confirmationEmail.json();

		if (emailRes) {
			return {
				success: 'Your email was successsfully submitted!'
			};
		}
	}
};
