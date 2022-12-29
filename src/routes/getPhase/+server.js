/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// @ts-nocheck
export function GET() {
	// TODO: enable passing a date
	// https://mags.ai/blog/sveltekit-endpoint-body-parsing/
	const LUNAR_MONTH = 29.530588853;
	const currentDate = new Date();

	const getJulianDate = (date) => {
		const time = date.getTime();
		const tzoffset = date.getTimezoneOffset();

		return time / 86400000 - tzoffset / 1440 + 2440587.5;
	};

	const normalize = (value) => {
		value = value - Math.floor(value);
		if (value < 0) {
			return (value = value + 1);
		} else return value;
	};

	const getLunarAgePercent = (date) => {
		return normalize((getJulianDate(date) - 2451550.1) / LUNAR_MONTH);
	};

	const getLunarAge = (date) => {
		const percent = getLunarAgePercent(date);
		const age = percent * LUNAR_MONTH;
		return age;
	};

	const getLunarPhase = (date) => {
		const age = getLunarAge(date);
		if (age < 1.84566) return 'New Moon';
		else if (age < 5.53699) return 'Waxing Crescent';
		else if (age < 9.22831) return 'First Quarter';
		else if (age < 12.91963) return 'Waxing Gibbous';
		else if (age < 16.61096) return 'Full Moon';
		else if (age < 20.30228) return 'Waning Gibbous';
		else if (age < 23.99361) return 'Third Quarter';
		else if (age < 27.68493) return 'Waning Crescent';
		else return 'New Moon';
	};

	const moonPhase = JSON.stringify(getLunarPhase(currentDate));

	return new Response(moonPhase, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
