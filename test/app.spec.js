var expect = require('chai').expect;
var request = require('supertest');
var pullRequestCreated = require('./pull-request-created');

describe('App Index', function () {
	var server, app, response;
	
	beforeEach(function () {
		server = undefined;
		app = undefined;
		response = undefined;
	});
	beforeEach(function () {
		app = require('../app')();
	});
	
	describe('when calling an unknown url', function () {
		beforeEach(function () {
			response = request(app)
				.get('/invalid/')
			;
		});
		
		it('should respond with not found', function (done) {
			response.end(function (err, res) {
				expect(res.status).to.equal(404);
				expect(res.body).to.be.empty;
				done();
			});
		});
	});
})
