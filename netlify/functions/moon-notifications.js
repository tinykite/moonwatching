exports.handler = async function (event, context) {
	console.log('Received event:', event);

	return {
		statusCode: 200,
		body: { message: 'Hello World' }
	};
};
