import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { formatISO, format, add } from 'date-fns';
import { error } from '@sveltejs/kit';
import * as astronomy from "$lib/astronomy-reference"
import { calculatePhase } from '$lib/moon-utils';

// This is an internal route used to calculate an entire years worth of dates.
export const GET = (async ({ url }) => {
	const searchParams = new URLSearchParams(url.search);
	const query = searchParams.get('date');

	if (!query) {
		throw error(500, 'No date provided');
	}

    const START_DATE = new Date(2025, 0, 1, 11, 59)
	const dates = []

	const getNextDay = (date, distanceFrom) => {
			const nextDay = add(date, {
        days: distanceFrom
      })

		return formatISO(nextDay)
	}

	let n = 0;

  while (n < 366) {
		const day = getNextDay(START_DATE, n)
		dates.push(day)
    n++;
  }

  const moonData = dates.map(date => {
    const newDate = new Date(date)
    const nextQuarter = astronomy.SearchMoonQuarter(date);
    const newPhase = calculatePhase({ nextQuarter, date });		
    return {
        date: formatISO(date, { representation: 'date' }), 
        year: newDate.getFullYear(),
        month: format(newDate, "LLLL"),
        phase: newPhase
    }
})

	return json(moonData);
}) satisfies RequestHandler;
