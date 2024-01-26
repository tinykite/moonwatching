import type { PageLoad } from './$types';
import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { format, sub, formatISO, monthsInQuarter } from "date-fns";

export const load = (async ({ fetch }) => {    
    // const { data: allPhases, error: allPhasesError } = await supabase
    // .from('all_phases')
    // .select('*')  

    // if (allPhasesError) {
    //     throw error
    // }

    // const { data: primaryPhases, error: primaryPhasesError } = await supabase
    // .from('primary_phases')
    // .select('*')  

    // if (primaryPhasesError) {
    //     throw error
    // }
    // return {

    // }
    return {}

}) satisfies PageLoad;
