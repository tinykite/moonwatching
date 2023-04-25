import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';
import { format } from 'date-fns';

export const GET = (async () => {
	const date = format(new Date(), 'yyyy-MM-dd');

	const { data: moonData } = await supabase
		.from('dynamic_phases')
		.select('phase, date, ecliptic_longitude')
		.eq('date', date)
		.single();

	if (!moonData) {
		throw error(500, 'Could not calculate moon phase');
	}

	return json(moonData);
}) satisfies RequestHandler;
