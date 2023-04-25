import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';
import { ALERT_KEY } from '$env/static/private';
import { format } from 'date-fns';

// // This endpoint returns data manually collected from the Griffifth Observatory website
// It is only intended for use by a Netlify function for sending automated emails
// For all other purposes, use the /phases and /phase endpoints
export const GET = (async ({ url, fetch }) => {
	const searchParams = new URLSearchParams(url.search);
	const cronRequest = searchParams.has('scheduledFunction');

	const functionTriggers = ['Full Moon', 'New Moon'];

	const date = format(new Date(), 'yyyy-MM-dd');

	const { data: moonData } = await supabase
		.from('phases')
		.select('phase, date, time, time_format')
		.eq('date', date)
		.single();

	if (!moonData || !moonData.phase) {
		return json('No major moon phases ocurring today');
	}

	const moonAlertDay = cronRequest && functionTriggers.includes(moonData?.phase);

	if (moonAlertDay) {
		const alert = await fetch('/api/alerts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${ALERT_KEY}`
			},
			body: JSON.stringify({
				...moonData
			})
		});

		const alertRes = await alert.json();

		if (!alert.ok) {
			throw error(alert.status, alertRes.message);
		}

		return json(alertRes);
	} else throw error(500, 'Not allowed');
}) satisfies RequestHandler;
