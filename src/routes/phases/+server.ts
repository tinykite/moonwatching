import { json, error } from '@sveltejs/kit';
import { addDays, format } from 'date-fns';
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

export const GET = (async () => {
	const currentDate = new Date();
	const startRange = format(currentDate, 'yyyy-MM-dd');
	const endRange = format(addDays(currentDate, 8), 'yyyy-MM-dd');

	// If current day is a major moon phase,
	// return that phase directly
	const { data: moonData } = await supabase
		.from('phases')
		.select('phase, date')
		.eq('date', startRange)
		.single();

	if (moonData) {
		return json(moonData.phase);
	}

	// If current day is between major phases,
	// query the database for the next major moon phase
	const { data: nextMoon } = await supabase
		.from('phases')
		.select('phase, date')
		.lt('date', endRange)
		.gt('date', startRange)
		.single();

	if (!nextMoon) {
		throw error(404, 'No moon data found');
	}

	// Calculate current (minor) phase based on next major phase
	const minorPhase = getMinorPhase(nextMoon.phase);

	return json(minorPhase);
}) satisfies RequestHandler;
