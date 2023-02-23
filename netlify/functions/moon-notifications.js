import fetch from 'node-fetch';

exports.handler = async function () {
	const res = await fetch('https://www.moon-watching.com/phases?scheduledFunction=true');
	const moonData = await res.json();

	if (!res.ok) {
		throw new Error(moonData.message);
	}

	console.log(moonData);

	return {
		statusCode: 200
	};
};
