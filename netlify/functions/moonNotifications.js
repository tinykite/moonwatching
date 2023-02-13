exports.handler = async function () {
	const res = await fetch('https://moon-watching.com/phases?details=true');
	const moonData = await res.json();

	if (!res.ok) {
		throw new Error('Moon phase could not be fetched');
	}

	console.log(moonData);

	return {
		statusCode: 200
	};
};
