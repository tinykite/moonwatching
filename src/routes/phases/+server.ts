import { json, error } from '@sveltejs/kit';
import { addDays, closestTo, format } from 'date-fns';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';
import { ALERT_KEY } from '$env/static/private';
import { supabasePrivate } from '$lib/supabaseClient';

type majorPhase = 'Full Moon' | 'Last Quarter' | 'First Quarter' | 'New Moon';
interface Moon {
	phase: majorPhase;
	date: string;
	ecliptic_longitude: number;
}

// Dummy data for testing
const testMoonData = {
	phase: 'Fictious New Moon',
	time: '08:39:00',
	time_format: 'PST'
};

// Calculate current minor phase based on the next major phase
// Moon phases in order: https://moon.nasa.gov/moon-in-motion/moon-phases/
const getMinorPhase = (phase: majorPhase) => {
	switch (phase) {
		case 'Full Moon':
			return {
				phase: 'Waxing Gibbous',
				ecliptic_longitude: 135 // Ecliptic longitude is a value in the range [0, 360]
				// The values returned here are estimated medians, and are not intended to be used for precise calculations.
				// TODO: Verify this against astronomy calculations for real dates
			};
		case 'Last Quarter':
			return {
				phase: 'Waning Gibbous',
				ecliptic_longitude: 225
			};
		case 'First Quarter':
			return {
				phase: 'Waxing Crescent',
				ecliptic_longitude: 45
			};
		case 'New Moon':
			return {
				phase: 'Waning Crescent',
				ecliptic_longitude: 315
			};
	}
};

// Sometimes the API returns two moon phases in the next 8 days
// Because of that, we need to calculate the nearest date
const getNearestMoon = ({
	futureMoons,
	currentDate
}: {
	futureMoons: Moon[];
	currentDate: Date;
}): Moon => {
	// Don't calculate nearest date if only one future moon phase is returned
	if (futureMoons.length === 1) {
		return futureMoons[0];
	}

	// Convert date strings to Date objects for each future moon phase
	const moonDates = futureMoons.map((moon) => new Date(moon.date));

	// Find nearest date to now
	const nearestDate = closestTo(currentDate, moonDates)?.toISOString().split('T')[0];

	if (!nearestDate) {
		throw error(400, 'Could not calculate nearest date');
	}

	const nearestMoon = futureMoons.find((moon) => moon.date === nearestDate);

	if (!nearestMoon) {
		throw error(400, 'Could not find a matching nearest moon');
	}

	return nearestMoon;
};

export const GET = (async ({ url, fetch }) => {
	const searchParams = new URLSearchParams(url.search);
	const cronRequest = searchParams.has('scheduledFunction');

	const functionTriggers = ['Full Moon', 'New Moon'];

	const currentDate = new Date();
	const startRange = format(currentDate, 'yyyy-MM-dd');
	const endRange = format(addDays(currentDate, 8), 'yyyy-MM-dd');

	// If current day is a major moon phase,
	// return that phase directly
	const { data: moonData } = await supabase
		.from('phases')
		.select('phase, date, time, time_format, ecliptic_longitude')
		.eq('date', startRange)
		.single();

	// Commenting out for testing
	const moonAlertDay = cronRequest && functionTriggers.includes(moonData?.phase);

	if (moonAlertDay) {
		const alert = await fetch('/alerts', {
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
	} else if (moonData) {
		return json(moonData);
	}

	// If current day is between major phases,
	// query the database for the next major moon phase
	const { data: nextMoon } = await supabase
		.from('phases')
		.select('phase, date, ecliptic_longitude')
		.lt('date', endRange)
		.gt('date', startRange);

	if (!nextMoon) {
		throw error(404, 'No moon data found');
	}

	const nearestMoon = getNearestMoon({ futureMoons: nextMoon, currentDate });

	if (!nearestMoon) {
		throw error(500, 'Could not calculate nearest moon');
	}

	const minorPhase = getMinorPhase(nearestMoon.phase);

	return json(minorPhase);
}) satisfies RequestHandler;
