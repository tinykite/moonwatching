import { format, startOfMonth, endOfMonth, sub, add } from 'date-fns';
import { articulatedMoonPaths } from './consts';
import { scaleLinear } from 'd3-scale'
import { formatISO } from 'date-fns/formatISO';
import { supabase } from '$lib/supabaseClient';

export const lookupPhase = async (date: Date) => {
	const formattedDate = formatISO(date,  { representation: 'date' })

	const { data: moonData, error: moonDataError } = await supabase
	.from('all_phases')
	.select('moon_phase')
	.eq('date', formattedDate)
	.single();
	
	if (moonDataError || !moonData.moon_phase) {
		return {
			phase: null,
			error: moonDataError
		}
	}
	
	return {
		phase: moonData.moon_phase,
		error: null
	}
}


export interface MoonPhase {
	moon_phase:
		| 'New Moon'
		| 'Last Quarter'
		| 'Full Moon'
		| 'First Quarter'
		| 'Waxing Crescent'
		| 'Waning Crescent'
		| 'Waning Gibbous'
		| 'Waxing Gibbous';
	moon_phase_float: number;
	subphase_max_length: number;
	subphase: number;
	date: string;
}

const moonPhaseMap = {
	'New Moon': "newMoon",
	'Last Quarter': "lastQuarter",
	'Full Moon': "fullMoon",
	"First Quarter": "firstQuarter",
	"Waxing Crescent": "waxingCrescent",
	"Waning Gibbous": "waningGibbous",
	"Waxing Gibbous": "waxingGibbous",
	"Waning Crescent": "waningCrescent"
}

const majorVisiblePhases = [
	'Full Moon', 'Last Quarter', 'First Quarter'
]

// New Moon: 0
// FirstQuarter: 50
// Full Moon: 100
// Last Quarter: 50
// Waxing Crescent and Waning Crescent: 0-50
// Waxing Gibbous and Waning Gibbous: 50-100

export const getArticulatedMoonPath = (phase: MoonPhase) => {
	const currentPhase = phase["moon_phase"]
	const moonId = moonPhaseMap[currentPhase]

	if (majorVisiblePhases.includes(currentPhase)) {
		return articulatedMoonPaths[moonId]
	}

	if (currentPhase === 'New Moon') {
		// This needs to be handled conditionally
		// But we'll return a default New Moon as a fallback
		return articulatedMoonPaths.newMoonA
	}

	const illustrationMaxLength = articulatedMoonPaths[moonId].length
	const currentMaxLength = phase.subphase_max_length
	const getScaledLength = scaleLinear().domain([1, currentMaxLength]).range([0, illustrationMaxLength - 1])
	const scaledLength = getScaledLength(phase.subphase)
	const illustrationIndex = Math.floor(scaledLength)

	return articulatedMoonPaths[moonId][illustrationIndex]
}

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
		return 'Last Quarter';
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
