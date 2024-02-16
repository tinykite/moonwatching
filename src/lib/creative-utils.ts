import { spline } from './spline';
import { getRandomNumber } from './math-utils';
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

export const defaultBlobs = {
		top: '',
		topAccent: '',
		middle: '',
		middleAccent: '',
		middleTertiary: '',
		bottom: '', 
		bottomAccent: ''
}

export const generateMoonBlobs = () => {
	let blobs = {...defaultBlobs}

	blobs.top = generateBlob({
		initialX: 170,
		initialY: 30,
		size: [140, 70],
		pullRange: [0.4, 0.7]
	});
	blobs.topAccent = generateBlob({
		initialX: 270,
		initialY: 30,
		size: [190, 20],
		pullRange: [0.5, 0.9]
	});
	blobs.middle = generateBlob({
		initialX: 50,
		initialY: 120,
		size: [180, 70],
		pullRange: [0.5, 0.7]
	});
	blobs.middleAccent = generateBlob({
		initialX: 25,
		initialY: 115,
		size: [90, 20],
		pullRange: [0.5, 0.9]
	});
	blobs.middleTertiary = generateBlob({
		initialX: 0,
		initialY: 115,
		size: [90, 8],
		pullRange: [0.6, 0.7]
	});
	blobs.bottom = generateBlob({
		initialX: 140,
		initialY: 160,
		size: [140, 70],
		pullRange: [0.3, 0.6]
	});
	blobs.bottomAccent = generateBlob({
		initialX: 215,
		initialY: 170,
		size: [100, 25],
		pullRange: [0.5, 0.9]
	});
	return blobs;
}

// TODO: Fix the crescent shapes, that were flip-flopped
export const getMoonPath = (phase) => {
	switch (phase) {
		case 'Full Moon':
			return moonPaths.fullMoon
		case 'New Moon':
			return moonPaths.newMoonA
		case 'Waxing Crescent': 
			return moonPaths.waningCrescent
		case "Waning Crescent":
			return moonPaths.waxingCrescent
		case 'First Quarter':
			return moonPaths.firstQuarter
		case 'Last Quarter':
			return moonPaths.lastQuarter
		default: 
			return moonPaths.newMoonA
	}
}