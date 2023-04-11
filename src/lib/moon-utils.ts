import { format, startOfMonth, endOfMonth, sub, add } from 'date-fns';

export const getCurrentQuarter = (quarter: number) => {
	if (quarter === 0) {
		return 'New Moon';
	}

	if (quarter === 1) {
		return 'First Quarter';
	}

	if (quarter === 2) {
		return 'Full Moon';
	}

	if (quarter === 3) {
		return 'Third Quarter';
	}
};

export const getPreviousQuarter = (quarter: number) => {
	if (quarter === 0) {
		return 'Waning Crescent';
	}

	if (quarter === 1) {
		return 'Waxing Crescent';
	}

	if (quarter === 2) {
		return 'Waxing Gibbous';
	}

	if (quarter === 3) {
		return 'Waning Gibbous';
	}
};

export const calculatePhase = ({ nextQuarter, date }: { nextQuarter: any; date: any }) => {
	const { quarter, time } = nextQuarter;

	const nextQuarterDate = format(time.date, 'MM/dd/yyyy');
	const currentDate = format(date, 'MM/dd/yyyy');

	// If the next quarter falls on the same day as the current date, return that phase as the current one
	if (nextQuarterDate === currentDate) {
		return getCurrentQuarter(quarter);
	}

	// Otherwise return the previous phase
	return getPreviousQuarter(quarter);
};

export const getMonthRange = () => {
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
