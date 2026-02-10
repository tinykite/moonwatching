import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { moonPhases2026 } from '../../data/moonPhaseData2026';
import { format } from 'date-fns';

export const load = (async () => {
    const currentDate = new Date();
    const currentMonth = format(currentDate, "MMMM");
    const currentYear = currentDate.getFullYear();

    // Filter data for current month and year
    const moonData = moonPhases2026[currentMonth]?.filter(
        entry => entry.year === currentYear
    );

    if (!moonData || moonData.length === 0) {
        throw error(400, {
            message: `No moon phase data available for ${currentMonth} ${currentYear}`
        });
    }

    return { moonData };
}) satisfies PageLoad;