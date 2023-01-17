import fetch from 'node-fetch';

exports.handler = async function () {
	const res = await fetch('https://moonwatching.netlify.app/phases');
	const moonPhase = await res.json();

	console.log(moonPhase);
	return {
		statusCode: 200
	};
};
