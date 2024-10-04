// import type { PageLoad } from './$types';
// import { error } from '@sveltejs/kit';
// import { supabase } from '$lib/supabaseClient';
// import { format } from 'date-fns';

// export const load = (async () => {
// 	const currentMonth = format(new Date(), "MMMM")

// 	const { data: moonData, error: moonDataError } = await supabase
//     .from('all_phases')
//     .select('moon_phase, date, moon_phase_float, subphase_max_length, subphase')
//     .eq('month', currentMonth)

//     if (moonDataError) {
//         throw error(400, moonDataError)
//     }

//     return { moonData }
// }) satisfies PageLoad;
