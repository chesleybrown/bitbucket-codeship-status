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
		
		// verify we have the information we need
		if (!req.body.pullrequest_created) {
			res.status(400).end();
			return;
		}
		var pullRequest = req.body.pullrequest_created;
		
		if (!pullRequest.id || !(pullRequest.source && pullRequest.source.branch && pullRequest.source.branch.name)) {
			res.status(400).end();
			return;
		}
		
		// update pull request description with codeship status widget
		// TODO: api call to update pull request
		
		res.status(204).end();
	});
	
	return app;
};