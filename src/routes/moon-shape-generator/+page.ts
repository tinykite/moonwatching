import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load = (async () => {
    let { data: all_phases, error } = await supabase
        .from('all_phases')
        .select('*')

    if (error) {
        throw error(400, error)
    }

    return { all_phases }

}) satisfies PageLoad;
