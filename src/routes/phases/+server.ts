import { json, error } from '@sveltejs/kit';
import { formatISO, addDays, format } from 'date-fns';
import { supabase } from '$lib/supabaseClient';

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

export async function GET() {
	const currentDate = new Date();
	const currentDateMinusTime = format(currentDate, 'yyyy-MM-dd');
	const startRange = formatISO(currentDate);
	const endRange = formatISO(addDays(new Date(), 8));

	const { data: nextMoon } = await supabase
		.from('phases')
		.select('phase, date')
		.lt('date', endRange)
		.gt('date', startRange)
		.single();

	if (!nextMoon) {
		throw error(400, 'Could not fetch moon data');
	}

	// If current day matches the date of a major moon phase
	if (nextMoon.date === currentDateMinusTime) {
		return json(nextMoon.phase);
	}

	// If current day is between major moon phases
	const minorPhase = getMinorPhase(nextMoon.phase);

	return json(minorPhase);
}
