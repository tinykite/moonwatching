import fetch from 'node-fetch';

exports.handler = async function () {
	const res = await fetch('https://moonwatching.netlify.app/phases');
	const moonData = await res.json();

	const { phase } = moonData;

	if (!res.ok) {
		throw new Error('Moon phase could not be fetched');
	}

	if (moonData.phase === 'Full Moon' || moonData.phase === 'New Moon') {
		const bulkEmailResponse = await fetch(`${process.env.PUBLIC_SERVER_PATH}/alerts`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				phase
			})
		});
		const emailRes = await bulkEmailResponse.json();

		if (!emailRes.ok) {
			throw new Error('Email could not be rendered');
		}
	}

	return {
		statusCode: 200
	};
};
