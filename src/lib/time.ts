export const getHour = ({ time, isPM }: { time: string; isPM: boolean }) => {
	// Remove leading 0 from time, so 06 is returned as 6
	const hour = parseInt(time);

	// translate hour 0 (midnight) to 12
	if (hour === 0) {
		return 12;
	}

	// translate hour 18 (6pm) to 6
	if (isPM && hour !== 12) {
		return hour - 12;
	}

	// Don't translate anything else: leave as-is
	return hour;
};
export const getFormattedTime = ({ time, timeFormat }: { time: string; timeFormat: string }) => {
	const unformattedTime = time.split(':');
	const isPM = parseInt(unformattedTime[0]) >= 12;
	const hour = getHour({ time: unformattedTime[0], isPM });
	const minute = unformattedTime[1];

	const formattedTime = `${hour}:${minute} ${isPM ? 'PM' : 'AM'} ${timeFormat}`;

	return formattedTime;
};
