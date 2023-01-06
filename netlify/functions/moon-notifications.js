exports.handler = async function (event) {
	console.log('Received event:', event);

	return {
		statusCode: 200,
		body: {}
	};
};
