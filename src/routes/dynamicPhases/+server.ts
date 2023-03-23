import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as astronomy from '$lib/astronomy-reference';
import { calculatePhase } from '$lib/moon-utils';

export const GET = (async () => {
	const date = new Date();
	const ecliptic = astronomy.MoonPhase(date);
	const nextQuarter = astronomy.SearchMoonQuarter(date);
	const phase = calculatePhase({ nextQuarter, date });

	return json({
		phase,
		ecliptic_longitude: ecliptic,
		date
	});
}) satisfies RequestHandler;
