import type { PageLoad } from './$types';
import { json } from '@sveltejs/kit';
import { formatISO } from "date-fns";
import { moonPhases2025 } from '../data/moonPhases2025';

export const load = (async () => {    
    const date = formatISO(new Date(),  { representation: 'date' })
    const moonData = moonPhases2025.find(phase => phase.date === date)

    return {...moonData}

}) satisfies PageLoad;
