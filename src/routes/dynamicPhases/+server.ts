import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';
import { endOfMonth, startOfMonth, sub, format, add } from 'date-fns';

const getMonthRange = () => {
	const date = new Date();
	const monthStart = startOfMonth(date);
	const monthEnd = endOfMonth(date);

	const adjustedStartDate = sub(monthStart, {
		days: 1
	});

	const adjustedEndDate = add(monthEnd, {
		days: 1
	});

	return { startRange: adjustedStartDate, endRange: adjustedEndDate };
};

export const GET = (async ({ url }) => {
	const searchParams = new URLSearchParams(url.search);
	const queryMonth = searchParams.has('month');

	const { startRange, endRange } = getMonthRange();

	if (!queryMonth) {
		throw error(401, 'No month parameter was provided');
	}

	const { data: moonData } = await supabase
		.from('dynamic_phases')
		.select('phase, date, ecliptic_longitude')
		.gt('date', format(startRange, 'yyyy-MM-dd'))
		.lt('date', format(endRange, 'yyyy-MM-dd'));

	if (!moonData) {
		throw error(500, 'Could not calculate moon phases');
	}

	return json(moonData);
}) satisfies RequestHandler;
