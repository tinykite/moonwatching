import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { PUBLIC_EMAIL_SERVER_PATH, PUBLIC_SERVER_PATH } from '$env/static/public';

export const GET: RequestHandler = async ({ params }) => {
	// TODO: Write a type for this params object
	const { templateName } = params;

	// Retrieve random moon image
	const moonImageRes = await fetch(`${PUBLIC_SERVER_PATH}/images`);
	const moonImage = await moonImageRes.json();

	if (!moonImageRes.ok) {
		console.log(templateName);
		throw error(404, moonImage.message);
	}

	// Retrieve a rendered email template, using the random moon image
	// Template name refers to which email template to use
	const emailHTML = await fetch(PUBLIC_EMAIL_SERVER_PATH, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			templateName,
			props: { moonImage }
		})
	});
	const emailRes = await emailHTML.json();

	if (!emailRes.html) {
		throw error(404, 'Email could not be rendered');
	}

	return json(emailRes.html);
};
