var expect = require('chai').expect;
var request = require('supertest');
var mockery = require('mockery');

describe('Pull Request', function () {
	var app, response, Request;
	
	before(function () {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false
		});
		mockery.registerMock('request', function (opt, callback) {
			return Request(opt, callback);
		});
		
		app = require('../app')();
	});
	
	describe('when ENV setup', function () {
		before(function () {
			process.env.BITBUCKET_USERNAME = 'username';
			process.env.BITBUCKET_PASSWORD = 'password';
		});
		
		describe('and WRONG correct credentials', function () {
			describe('and pull request data is valid, but description is empty', function () {
				before(function (done) {
					request(app)
						.post('/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132')
						.auth('wrong_username', 'wrong_password')
						.send(require('./pull-request-created'))
						.end(function (err, res) {
							response = res;
							done();
						})
					;
				});
				
				it('should respond with access denied', function () {
					expect(response.status).to.equal(401);
					expect(response.body).to.be.empty;
				});
			});
		});
		
		describe('and correct credentials', function () {
			describe('when pull request data posted to valid url', function () {
				describe('and no pull request data', function () {
					before(function (done) {
						request(app)
							.post('/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132')
							.auth('username', 'password')
							.end(function (err, res) {
								response = res;
								done();
							})
						;
					});
					
					it('should respond with invalid request', function () {
						expect(response.status).to.equal(400);
						expect(response.body).to.be.empty;
					});
				});
				
				describe('and pull request data missing required information', function () {
					before(function (done) {
						request(app)
							.post('/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132')
							.auth('username', 'password')
							.send({id: 500})
							.end(function (err, res) {
								response = res;
								done();
							})
						;
					});
					
					it('should respond with invalid request', function () {
						expect(response.status).to.equal(400);
						expect(response.body).to.be.empty;
					});
				});
				
				describe('and pull request data is valid, but description is empty', function () {
					before(function (done) {
						Request = function (opt, callback) {
							callback(null, {statusCode: 201});
						};
						
						var pullRequestCreated = require('./pull-request-created');
						pullRequestCreated.pullrequest_created.description = '';
						request(app)
							.post('/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132')
							.auth('username', 'password')
							.send(pullRequestCreated)
							.end(function (err, res) {
								response = res;
								done();
							})
						;
					});
					
					it('should respond with success', function () {
						expect(response.status).to.equal(204);
						expect(response.body).to.be.empty;
					});
				});
				
				describe('and pull request data is valid', function () {
					before(function (done) {
						Request = function (opt, callback) {
							callback(null, {statusCode: 201});
						};
						
						request(app)
							.post('/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132')
							.auth('username', 'password')
							.send(require('./pull-request-created'))
							.end(function (err, res) {
								response = res;
								done();
							})
						;
					});
					
					it('should respond with success', function () {
						expect(response.status).to.equal(204);
						expect(response.body).to.be.empty;
					});
				});
			});
		});
		
		after(function () {
			mockery.disable();
			delete process.env.BITBUCKET_USERNAME;
			delete process.env.BITBUCKET_PASSWORD;
		});
	});
});