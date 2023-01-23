import { json } from '@sveltejs/kit';
import { formatISO, addDays, format } from 'date-fns';
import { supabase } from '$lib/supabaseClient';

// Calculate current minor phase based on the next major phase
const getMinorPhase = (phase) => {
	switch (phase) {
		case 'Full Moon':
			return 'Waxing Gibbous';
		case 'Last Quarter':
			return 'Waning Crescent';
		case 'First Quarter':
			return 'Waxing Crescent';
		case 'New Moon':
		default:
			return 'Waning Crescent';
	}
};

export async function GET() {
	let moonPhase;
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

	if (nextMoon?.date === currentDateMinusTime) {
		moonPhase = nextMoon.phase;
	} else {
		moonPhase = getMinorPhase(nextMoon.phase);
	}

	return json(moonPhase);
}
