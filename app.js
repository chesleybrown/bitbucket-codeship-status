'use strict';

module.exports = function () {
	var express = require('express');
	var bodyParser = require('body-parser');
	var request = require('request');
	var basicAuth = require('basic-auth-connect');
	var app = express();
	var log4js = require('log4js');
	var logger = log4js.getLogger();
	
	app.use('/media', express.static(__dirname + '/media'));
	app.use(bodyParser.json());
	app.set('view engine', 'ejs');
	app.enable('trust proxy');
	
	app.get('/', function (req, res) {
		request({
			url: 'https://' + process.env.BITBUCKET_USERNAME + ':' + process.env.BITBUCKET_PASSWORD + '@api.bitbucket.org/2.0/users/chesleybrown',
			method: 'GET'
		}, function (err, response) {
			res.render('index', {
				BITBUCKET_USERNAME: process.env.BITBUCKET_USERNAME,
				BITBUCKET_PASSWORD: Boolean(process.env.BITBUCKET_PASSWORD),
				ssl: (req.protocol === 'https') ? true : false,
				host: req.get('host'),
				authenticated: (err || response.statusCode !== 200) ? false : true
			});
		});
	});
	
	app.post('/pull-request/:codeshipProjectUuid/:codeshipProjectId', basicAuth(function (username, password) {
		return (username === process.env.BITBUCKET_USERNAME && password === process.env.BITBUCKET_PASSWORD);
	}), function (req, res) {
		// verify we have the information we need
		if (Object.keys(req.body).length === 0 || !req.body.pullrequest) {
			logger.error('Invalid request: missing "pullrequest"');
			res.status(400).end();
			return;
		}
		var pullRequest = req.body.pullrequest;
		
		if (!pullRequest.id || typeof pullRequest.description !== 'string' || !(pullRequest.source && pullRequest.source.branch && pullRequest.source.branch.name) || !(pullRequest.source && pullRequest.source.repository && pullRequest.source.repository.full_name)) {
			logger.error('Invalid pull request provided. Was given:', pullRequest);
			res.status(400).end();
			return;
		}
		
		// if it doesn't already have Codeship status at the start of the description, let's add it
		if (pullRequest.description.indexOf('[ ![Codeship Status') !== 0) {
			var widget = '[ ![Codeship Status for ' + pullRequest.source.repository.full_name + '](https://codeship.com/projects/' + req.params.codeshipProjectUuid + '/status?branch=' + pullRequest.source.branch.name + ')](https://codeship.com/projects/' + req.params.codeshipProjectId + ')';
			pullRequest.description = widget + '\r\n\r\n' + pullRequest.description;
			
			request({
				url: 'https://' + process.env.BITBUCKET_USERNAME + ':' + process.env.BITBUCKET_PASSWORD + '@api.bitbucket.org/2.0/repositories/' + pullRequest.source.repository.full_name + '/pullrequests/' + pullRequest.id,
				method: 'PUT',
				json: pullRequest
			}, function (err, response) {
				if (err) {
					logger.error('Error while adding codeship status to pull request:', err);
					res.status(500).end();
					return;
				}
				
				if (response.body && response.body.error) {
					logger.error('Unexpected error while adding codeship status to pull request:', request.body.error);
					res.status(500).end();
					return;
				}
				
				logger.info('Successfully added codeship status to pull request');
				res.status(204).end();
			});
		}
		else {
			logger.info('Pull request already has codeship status');
			res.status(204).end();
		}
	});
	
	return app;
};
