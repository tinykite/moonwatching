// import { json } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';
// import { eachDayOfInterval, isValid, addYears } from 'date-fns';
// import { error } from '@sveltejs/kit';

// // This is an internal route used to calculate an entire years worth of dates.
// export const GET = (async ({ url }) => {
// 	const searchParams = new URLSearchParams(url.search);
// 	const query = searchParams.get('date');

// 	if (!query) {
// 		throw error(500, 'No date provided');
// 	}

// 	const validDate = isValid(new Date(query));

// 	if (!validDate) {
// 		throw error(500, 'Invalid date provided');
// 	}

// 	const startDate = new Date(query);
// 	const endDate = addYears(startDate, 1);

// 	const calendarYear = eachDayOfInterval({
// 		start: startDate,
// 		end: endDate
// 	});

// 	return json(calendarYear);
// }) satisfies RequestHandler;
