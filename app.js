var express = require('express');
var bodyParser = require('body-parser');

module.exports = function () {
	var app = express();
	
	app.use(bodyParser.json());
	
	app.post('/pull-request/:codeshipProjectGuid/:codeshipProjectId', function (req, res) {
		if (Object.keys(req.body).length === 0) {
			res.status(400).end();
			return;
		}
		
		res.status(204).end();
	});
	
	return app;
};