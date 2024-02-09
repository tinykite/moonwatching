import type { PageLoad } from './$types';
import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import { formatISO } from "date-fns";

export const load = (async () => {    
    const date = formatISO(new Date(),  { representation: 'date' })

    const { data: moonData, error: moonDataError } = await supabase
    .from('all_phases')
    .select('moon_phase, date')
    .eq('date', date)
    .single();

    if (moonDataError) {
        throw error(400, moonDataError)
    }

    return moonData

}) satisfies PageLoad;
