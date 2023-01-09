import { fail } from '@sveltejs/kit';

// As per the HTML Specification
const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, url }) => {
		const data = await request.formData();
		const email = data.get('email');
		const isValid = emailRegExp.test(email);
		console.log(isValid);

		if (!email) {
			return fail(422, {
				email: data.get('email'),
				error: 'Your email is required'
			});
		}

		// Should be caught by the browser (based on type="email"), but just in case input type is removed
		if (!isValid) {
			return fail(422, {
				email: data.get('email'),
				error: 'Your email is not valid'
			});
		}

		return {
			success: 'Your email has been submitted!'
		};
	}
};
