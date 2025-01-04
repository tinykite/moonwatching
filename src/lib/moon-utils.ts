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