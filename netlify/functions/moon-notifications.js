import fetch from 'node-fetch';

exports.handler = async function () {
	const res = await fetch('http://127.0.0.1:5173/getEmails');
	const moonPhase = await res.json();

	console.log(moonPhase);
	return {
		statusCode: 200
	};
};
