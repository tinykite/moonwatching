const fetch = require('node-fetch');

exports.handler = async function (event) {
	const res = await fetch('https://moonwatching.netlify.app/getPhase');
	const moonPhase = await res.json();

	console.log(`Current phase: ${moonPhase}`);
	console.log(event.body);

	return {
		statusCode: 200
	};
};
