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
	
	describe('when pull request data posted to valid url', function () {
		beforeEach(function () {
			response = request(app)
				.post('/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132')
			;
		});
		
		describe('and no pull request data', function () {
			it('should respond with invalid request', function (done) {
				response.end(function (err, res) {
					expect(res.status).to.equal(400);
					expect(res.body).to.be.empty;
					done();
				});
			});
		});
		
		describe('and pull request data is valid', function () {
			beforeEach(function () {
				response.send(pullRequestCreated);
			});
			
			it('should respond with success', function (done) {
				response.end(function (err, res) {
					expect(res.status).to.equal(204);
					expect(res.body).to.be.empty;
					done();
				});
			});
		});
	});
})
