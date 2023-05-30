import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';
import { format } from 'date-fns';

export const GET = (async () => {
	const date = new Date();

	const { data: moonData } = await supabase
		.from('dynamic_phases')
		.select('phase, date, ecliptic_longitude')
		.eq('date', format(date, 'yyyy-MM-dd'))
		.single();

	if (!moonData) {
		throw error(500, 'Could not calculate moon phase');
	}

	return json({ ...moonData, date: format(date, 'MMMM do, yyyy') });
}) satisfies RequestHandler;
