interface lerpOptions {
	domain: number[];
	range: number[];
	value: number;
}

// Note: Often in animation, a lerp (or linear interpolation) function will interpolate between two values
// For example, lerp(0, 100, 0.5) would return 50
// This function tackles the more general use case for linear interpolation, which calculates the equivalent value between two ranges
// For example, lerp({ domain: [0, 100], range: [0, 200], value: 50 }) would return 100
export const interpolate = ({ domain, range, value }: lerpOptions): number => {
	const [x1, x2] = domain;
	const [y1, y2] = range;

	return y1 + ((y2 - y1) / (x2 - x1)) * (value - x1);
};
