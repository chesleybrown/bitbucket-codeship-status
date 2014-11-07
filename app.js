var express = require('express');
var bodyParser = require('body-parser');
var Request = require('request');

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
		
		if (!pullRequest.id || !pullRequest.description || !(pullRequest.source && pullRequest.source.branch && pullRequest.source.branch.name) || !(pullRequest.source && pullRequest.source.repository && pullRequest.source.repository.full_name)) {
			res.status(400).end();
			return;
		}
		
		// if it doesn't already have Codeship status at the start of the description, let's add it
		if (pullRequest.description.indexOf('[ ![Codeship Status') !== 0) {
			var widget = '[ ![Codeship Status for ' + pullRequest.source.repository.full_name + '](https://codeship.io/projects/' + req.param('codeshipProjectGuid') +'/status?branch=' + pullRequest.source.branch.name + ')](https://codeship.io/projects/' + req.param('codeshipProjectId') + ')';
			pullRequest.description = widget + '\r\n\r\n' + pullRequest.description;
			
			Request({
				url: 'https://' + process.env.BITBUCKET_USERNAME + ':' + process.env.BITBUCKET_PASSWORD + '@api.bitbucket.org/2.0/repositories/' + pullRequest.source.repository.full_name + '/pullrequests/' + pullRequest.id,
				method: 'PUT',
				json: {
					title: pullRequest.title,
					description: pullRequest.description
				}
			}, function (err, response, body) {
				if (err) {
					res.status(500).end();
					return;
				}
				
				if (response.body && response.body.error) {
					res.status(500).end();
					return;
				}
				
				res.status(204).end();
			});
		}
		else {
			res.status(204).end();
		}
	});
	
	return app;
};