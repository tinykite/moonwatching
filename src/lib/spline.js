// TODO: Propose fix to spline.js that avoids the need for this local import
// Currently, Vite breaks in production because of the way that the spline function is exported in the npm package
// https://github.com/georgedoescode/splinejs/blob/main/spline.js

// MIT License

// Copyright (c) 2020 George Francis

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function formatPoints(points, close) {
	points = [...points];
	// so that coords can be passed as objects or arrays
	if (!Array.isArray(points[0])) {
		points = points.map(({ x, y }) => [x, y]);
	}

	if (close) {
		const lastPoint = points[points.length - 1];
		const secondToLastPoint = points[points.length - 2];

		const firstPoint = points[0];
		const secondPoint = points[1];

		points.unshift(lastPoint);
		points.unshift(secondToLastPoint);

		points.push(firstPoint);
		points.push(secondPoint);
	}

	return points.flat();
}

export function spline(points = [], tension = 1, close = false, cb) {
	points = formatPoints(points, close);

	const size = points.length;
	const last = size - 4;

	const startPointX = close ? points[2] : points[0];
	const startPointY = close ? points[3] : points[1];

	let path = 'M' + [startPointX, startPointY];

	cb && cb('MOVE', [startPointX, startPointY]);

	const startIteration = close ? 2 : 0;
	const maxIteration = close ? size - 4 : size - 2;
	const inc = 2;

	for (let i = startIteration; i < maxIteration; i += inc) {
		const x0 = i ? points[i - 2] : points[0];
		const y0 = i ? points[i - 1] : points[1];

		const x1 = points[i + 0];
		const y1 = points[i + 1];

		const x2 = points[i + 2];
		const y2 = points[i + 3];

		const x3 = i !== last ? points[i + 4] : x2;
		const y3 = i !== last ? points[i + 5] : y2;

		const cp1x = x1 + ((x2 - x0) / 6) * tension;
		const cp1y = y1 + ((y2 - y0) / 6) * tension;

		const cp2x = x2 - ((x3 - x1) / 6) * tension;
		const cp2y = y2 - ((y3 - y1) / 6) * tension;

		path += 'C' + [cp1x, cp1y, cp2x, cp2y, x2, y2];

		cb && cb('CURVE', [cp1x, cp1y, cp2x, cp2y, x2, y2]);
	}

	return path;
}
