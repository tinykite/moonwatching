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

		if (error) {
			return fail(422, {
				email: data.get('email'),
				error: error.message
			});
		}

		return {
			success: 'Your email has been submitted!'
		};
	}
};
