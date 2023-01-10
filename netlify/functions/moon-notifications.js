exports.handler = async function (event) {
	const res = await fetch(`/getPhase`);
	const moonPhase = await res.json();

	console.log(event.json);
	console.log(`Current phase: ${moonPhase}`);

	return {
		statusCode: 200,
		body: {}
	};
};
