var app = require('./app');

// get port using environment variable or use default 8000
var port = (process.env.PORT) ? process.env.PORT : 8000;

var server = app().listen(port, function () {
	var host = server.address().address;
	console.log('Listening at http://%s:%s', host, port)
});