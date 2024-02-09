import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';
import { ALERT_KEY } from '$env/static/private';
import { format } from 'date-fns';

// This endpoint is only used by a Netlify function that handles moon alerts. It is not used for any other purpose, just yet.
export const GET = (async ({ url, fetch }) => {
	const searchParams = new URLSearchParams(url.search);
	const cronRequest = searchParams.has('scheduledFunction');

	const functionTriggers = ['Full Moon', 'New Moon'];

	const date = format(new Date(), 'yyyy-MM-dd');

	const { data: moonData } = await supabase
		.from('primary_phases')
		.select('moon_phase, date, time')
		.eq('date', date)
		.single();

	if (!moonData || !moonData.moon_phase) {
		return json('No major moon phases ocurring today');
	}

	const moonAlertDay = cronRequest && functionTriggers.includes(moonData?.moon_phase);

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
