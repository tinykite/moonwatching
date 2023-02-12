import { json, error } from '@sveltejs/kit';
import { addDays, closestTo, format } from 'date-fns';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

type majorPhases = 'Full Moon' | 'Last Quarter' | 'First Quarter' | 'New Moon';

// Calculate current minor phase based on the next major phase
// Moon phases in order: https://moon.nasa.gov/moon-in-motion/moon-phases/
const getMinorPhase = (phase: majorPhases) => {
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
	futureMoons: Array<{
		phase: any; // TODO: Fix types here
		date: any;
	}>;
	currentDate: Date;
}) => {
	// Don't calculate nearest date if only one date is returned
	if (futureMoons.length === 1) {
		return futureMoons;
	}

	const moonDates = futureMoons.map((moon) => new Date(moon.date));
	const nearestDate = closestTo(currentDate, moonDates)?.toISOString().split('T');

	if (!nearestDate) {
		throw error(500, 'Could not calculate nearest date');
	}

	const nearestMoon = futureMoons.find((moon) => moon.date === nearestDate[0]);

	return nearestMoon;
};

export const GET = (async ({ url }) => {
	const searchParams = new URLSearchParams(url.search);
	const returnDetails = searchParams.has('details');

	const currentDate = new Date();
	// TODO: Calculate min/max interval between major moon phases
	const startRange = format(currentDate, 'yyyy-MM-dd');
	const endRange = format(addDays(currentDate, 10), 'yyyy-MM-dd');

	// If current day is a major moon phase,
	// return that phase directly
	const { data: moonData } = await supabase
		.from('phases')
		.select('phase, date, time, time_format')
		.eq('date', startRange)
		.single();

	if (moonData && returnDetails) {
		return json({ ...moonData });
	}

	if (moonData) {
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
