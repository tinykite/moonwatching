import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_EMAIL_SERVER_PATH } from '$env/static/public';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const searchParams = new URLSearchParams(url.search);
	const templateName = searchParams.get('templateName');
	const isMoonAlert = templateName === 'MoonAlert';

	// TODO: Refactor this into function
	const time = isMoonAlert ? searchParams.get('time') : null;
	const phase = isMoonAlert ? searchParams.get('phase') : null;

	// Retrieve random moon image
	const moonImageRes = await fetch('/images');
	const moonImage = await moonImageRes.json();

	if (!moonImageRes.ok) {
		throw error(404, moonImage.message);
	}

	const emailProps = { templateName, moonImage, ...(isMoonAlert && { time, phase }) };

	// Retrieve a rendered email template, using the random moon image
	// Template name refers to which email template to use
	const emailHTML = await fetch(PUBLIC_EMAIL_SERVER_PATH, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			templateName,
			props: { ...emailProps }
		})
	});
	const emailRes = await emailHTML.json();

	if (!emailRes.html) {
		throw error(404, 'Email could not be rendered');
	}

	return json(emailRes.html);
};
