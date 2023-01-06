exports.handler = async function (event) {
	console.log('Next event:', event.body);

	return {
		statusCode: 200,
		body: {}
	};
};
