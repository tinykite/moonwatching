import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_EMAIL_SERVER_PATH } from '$env/static/public';

// const moonImage = {
// 	fileName: 'crescent-moon-and-mountain.jpg',
// 	description:
// 		'A crescent moon sets near a mountain on March 12, 2013. Despite the clouds, the darker part of the Moon can be seen to be illuminated by reflected Earthshine.',
// 	alt: 'A crescent moon above a mountain',
// 	credit: 'NASA/Bill Dunford',
// 	sourceUrl: 'https://moon.nasa.gov/resources/72/crescent-moon-and-mountain/?category=images'
// };

export const GET: RequestHandler = async ({ fetch, url }) => {
	const searchParams = new URLSearchParams(url.search);
	const templateName = searchParams.get('templateName');
	const isMoonAlert =
		templateName === 'MoonAlertTemplate' || templateName === 'MoonAlertBasicTemplate';

	const time = isMoonAlert ? searchParams.get('time') : null;
	const phase = isMoonAlert ? searchParams.get('phase') : null;

	// Retrieve random moon image
	// Commented out for now
	// const moonImageRes = await fetch('/images');
	// const moonImage = await moonImageRes.json();

	// if (!moonImageRes.ok) {
	// 	throw error(404, moonImage.message);
	// }

	const emailProps = { templateName, ...(isMoonAlert && { time, phase }) };

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
