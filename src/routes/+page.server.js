import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

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

		const { data: subscriber } = await supabase
			.from('subscribers')
			.select('email')
			.eq('email', email);

		if (subscriber) {
			// 	const res = await fetch(`/email`, {
			// 		method: 'POST',
			// 		headers: {
			// 			'Content-Type': 'application/json'
			// 		},
			// 		body: JSON.stringify({
			// 			email: subscriber[0].email
			// 		})
			// 	});

			// 	const success = await res.json();

			// 	if (error) {
			// 		return fail(422, { error });
			// 	}

			// 	if (success) {
			// 		console.log(res.json);
			// 	}

			return {
				success: 'Your email was successsfully submitted!'
			};
		}
	}
};
