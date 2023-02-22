import { json, error } from '@sveltejs/kit';
import { addDays, closestTo, format } from 'date-fns';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';
import { ALERT_KEY } from '$env/static/private';

type majorPhase = 'Full Moon' | 'Last Quarter' | 'First Quarter' | 'New Moon';
interface Moon {
	phase: majorPhase;
	date: string;
}

// Dummy data for testing
const testMoonData = {
	phase: 'New Moon',
	date: '2023-07-03',
	time: '04:39:00',
	time_format: 'PDT'
};

// Calculate current minor phase based on the next major phase
// Moon phases in order: https://moon.nasa.gov/moon-in-motion/moon-phases/
const getMinorPhase = (phase: majorPhase) => {
	switch (phase) {
		case 'Full Moon':
			return 'Waxing Gibbous';
		case 'Last Quarter':
			return 'Waning Gibbous';
		case 'First Quarter':
			return 'Waxing Crescent';
		case 'New Moon':
			return 'Waning Crescent';
	}
};

const getNearestMoon = ({
	futureMoons,
	currentDate
}: {
	futureMoons: Moon[];
	currentDate: Date;
}): Moon => {
	// Don't calculate nearest date if only one date is returned
	if (futureMoons.length === 1) {
		return futureMoons[0];
	}

	// Only necessary for situations where there are two moon phases in the next 8 days
	const moonDates = futureMoons.map((moon) => new Date(moon.date));
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

export const GET = (async ({ url }) => {
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
		.select('phase, date, time, time_format')
		.eq('date', startRange)
		.single();

	const moonAlertDay = functionTriggers.includes(moonData?.phase);

	// Not checking for moonAlertDay here just yet for testing purposes
	if (cronRequest) {
		const alertRes = await fetch('/alerts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: ALERT_KEY
			},
			body: JSON.stringify({
				testMoonData
			})
		});

		return json(alertRes);
	}

	if (moonData && !cronRequest) {
		return json(moonData.phase);
	}

	// If current day is between major phases,
	// query the database for the next major moon phase
	const { data: nextMoon } = await supabase
		.from('phases')
		.select('phase, date')
		.lt('date', endRange)
		.gt('date', startRange);

	if (!nextMoon) {
		throw error(404, 'No moon data found');
	}

	// Sometimes the API will return more than one upcoming phase
	// This happens because of the variability of the length of different moon phases
	const nearestMoon = getNearestMoon({ futureMoons: nextMoon, currentDate });

	if (!nearestMoon) {
		throw error(500, 'Could not calculate nearest moon');
	}

	const minorPhase = getMinorPhase(nearestMoon.phase);

	return json(minorPhase);
}) satisfies RequestHandler;
