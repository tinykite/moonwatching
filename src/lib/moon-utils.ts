import { format, startOfMonth, endOfMonth, sub, add } from 'date-fns';
import { articulatedMoonPaths } from './consts';
import { scaleLinear } from 'd3-scale'

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

export const getArticulatedMoonPath = (phase: MoonPhase, date: string) => {
	const currentPhase = phase["moon_phase"]
	const moonId = moonPhaseMap[currentPhase]

	if (majorVisiblePhases.includes(currentPhase)) {
		return articulatedMoonPaths[moonId]
	}

	if (currentPhase === 'New Moon') {
		// We'll handle this case later
		return
	}

	const illustrationMaxLength = articulatedMoonPaths[moonId].length
	const currentMaxLength = phase.subphase_max_length
	const getScaledLength = scaleLinear().domain([0, currentMaxLength]).range([0, illustrationMaxLength])
	const scaledLength = getScaledLength(phase.subphase)
	const illustrationIndex = illustrationMaxLength > currentMaxLength ? Math.ceil(scaledLength) : Math.floor(scaledLength)

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


const getMajorMoonPhases = (allPhases, majorPhases) => {
	return allPhases.map(phase => {
	const phaseData = majorPhases.find(majorPhase => majorPhase.date === phase.date)
	if (phaseData) {

		return {
			...phase, 
			major_moon_phase: phaseData.moon_phase
		}

	}

	return phase
  })
}

const getPreviousDay = (date: Date, subtractDays: number) => {
	const previousDay = sub(date, { days: subtractDays})
	return formatISO(previousDay, { representation: 'date' })
}

const getPreviousMoonPhase = (phase, primaryPhaseData) => {
	const prevDate = phase.date.split('-')
	const formattedDate = new Date(prevDate[0], prevDate[1], prevDate[2])
	let numberDaysInPast = 1
	let foundPreviousPhase = false

	while (foundPreviousPhase === false) {
		const dayInPast = getPreviousDay(formattedDate, numberDaysInPast)
		const moonPhaseData = primaryPhaseData.find(phase => phase.date === dayInPast)

		if (moonPhaseData?.major_moon_phase) {
			foundPreviousPhase = true
			return moonPhaseData
		}

		else {
			numberDaysInPast += 1;
		}
	}
}

const getMinorMoonPhase = (pastPhase) => {
	if (pastPhase === "New Moon") {
		return "Waxing Crescent"
	} 

	if (pastPhase === "First Quarter") 
	{
		return "Waxing Gibbous"
	}

	if (pastPhase === "Full Moon") {
		return "Waning Gibbous"
	}

	if (pastPhase === "Last Quarter") {
		return "Waning Crescent"
	}
}

const getAllPhaseData = (majorMoonPhaseData) => {
	return majorMoonPhaseData.map(phase => {
		if (phase.major_moon_phase) {
			return {
				...phase, 
				source: "astronomical_applications_dept"
			}
		}
	
		else {
			const previousMoonPhase = getPreviousMoonPhase(phase, primaryPhaseData)
			const minorMoonPhase = getMinorMoonPhase(previousMoonPhase.major_moon_phase)
			return {
				...phase, 
				minor_moon_phase: minorMoonPhase,
				source: "moonwatching"
			}
		}
	})
}

const getSimplifiedPhaseData = (phases) => {
	return phases.map(phase => {
		return {
			date: phase.date, 
			moon_phase_float: phase.moon_phase_float,
			month: phase.month,
			year: phase.year,
			source: phase.source,
			moon_phase_name: phase?.minor_moon_phase ? phase.minor_moon_phase : phase.major_moon_phase
		}
	})
}