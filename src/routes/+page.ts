import type { PageLoad } from './$types';
import { formatISO, format } from "date-fns";
import { moonPhases2026 } from '../data/moonPhaseData2026';

export const load = (async () => {    
    const currentDate = new Date();
    const date = formatISO(currentDate, { representation: 'date' });
    const monthName = format(currentDate, "MMMM");
    
    const moonData = moonPhases2026[monthName]?.find(phase => phase.date === date);

    return { ...moonData };

}) satisfies PageLoad;