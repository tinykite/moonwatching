import { spline } from './spline';
import { getRandomNumber } from './math-utils';
import * as flubber from 'flubber';
import { moonPaths } from '$lib/consts';

export const generateBlob = ({
	initialX,
	initialY,
	size,
	pullRange
}: {
	initialX: number;
	initialY: number;
	size: [number, number];
	pullRange: [number, number];
}) => {
	// choose a number of points
	const numPoints = getRandomNumber(15, 20);
	// step used to place each point at equal distances
	const angleStep = (Math.PI * 2) / numPoints;

	// keep track of your points
	const points = [];
	const [pullMin, pullMax] = pullRange;
	const [xSize, ySize] = size;

	for (let i = 1; i <= numPoints; i++) {
		// how much randomness should be added to each point
		const pull = getRandomNumber(pullMin, pullMax, true);

		// x & y coordinates of the current point
		const x = initialX + Math.cos(i * angleStep) * (xSize * pull);
		const y = initialY + Math.sin(i * angleStep) * (ySize * pull);

		// push the point to the points array
		points.push({ x, y });
	}

	// generate a smooth continuous curve based on the point:
	return spline(points, 1, true);
};

let flubberInterpolate = flubber.interpolate ?? flubber.default.interpolate;

export const newMoonToWaxingCrescent = flubberInterpolate(moonPaths.newMoonA, moonPaths.waxingCrescent);
export const waxingCrescentToFirstQuarter = flubberInterpolate(
	moonPaths.waxingCrescent,
	moonPaths.firstQuarter
);
export const firstQuarterToFullMoon = flubberInterpolate(moonPaths.firstQuarter, moonPaths.fullMoon);
export const fullMoonToLastQuarter = flubberInterpolate(moonPaths.fullMoon, moonPaths.lastQuarter);
export const lastQuarterToWaningCrescent = flubberInterpolate(
	moonPaths.lastQuarter,
	moonPaths.waningCrescent
);
export const waningCrescentToNewMoon = flubberInterpolate(moonPaths.waningCrescent, moonPaths.newMoonB);

export const getMoonPath = (phase) => {
	switch (phase) {
		case 'Full Moon':
			return moonPaths.fullMoon
		case 'New Moon':
			return moonPaths.newMoonA
		case 'Waxing Crescent': 
			return moonPaths.waxingCrescent
		case "Waning Crescent":
			return moonPaths.waningCrescent
		case 'First Quarter':
			return moonPaths.firstQuarter
		case 'Last Quarter':
			return moonPaths.lastQuarter
		default: 
			return moonPaths.newMoonA
	}
}