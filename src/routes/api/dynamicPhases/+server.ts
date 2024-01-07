// import { json, error } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';
// import { supabase } from '$lib/supabaseClient';
// import { getMonthRange } from '$lib/moon-utils';
// import { format } from 'date-fns';

// export const GET = (async ({ url }) => {
// 	const searchParams = new URLSearchParams(url.search);
// 	const queryMonth = searchParams.has('month');

// 	const { startRange, endRange } = getMonthRange();

// 	if (!queryMonth) {
// 		throw error(401, 'No month parameter was provided');
// 	}

// 	const { data: moonData } = await supabase
// 		.from('dynamic_phases')
// 		.select('phase, date, ecliptic_longitude')
// 		.gt('date', format(startRange, 'yyyy-MM-dd'))
// 		.lt('date', format(endRange, 'yyyy-MM-dd'));

// 	if (!moonData) {
// 		throw error(500, 'Could not calculate moon phases');
// 	}

// 	return json(moonData);
// }) satisfies RequestHandler;
