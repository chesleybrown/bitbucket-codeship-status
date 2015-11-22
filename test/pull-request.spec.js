'use strict';

var chai = require('chai');
var sinon  = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var testRequest = require('supertest');
var mockery = require('mockery');
var log4js = require('log4js');
var errorSpy = sinon.spy();
var infoSpy = sinon.spy();
var getLoggerStub = sinon.stub(log4js, 'getLogger');
getLoggerStub.returns({
	error: errorSpy,
	info: infoSpy
});

describe('Pull Request', function () {
	var app, response, request;
	
	before(function () {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false
		});
		mockery.registerMock('request', function (opt, callback) {
			return request(opt, callback);
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
					testRequest(app)
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
						testRequest(app)
							.post('/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132')
							.auth('username', 'password')
							.end(function (err, res) {
								response = res;
								done();
							})
						;
					});
					
					it('should log invalid request error', function () {
						expect(errorSpy).to.have.been.calledOnce;
						expect(errorSpy).to.have.been.calledWith('Invalid request: missing "pullrequest"');
					});
					it('should respond with invalid request', function () {
						expect(response.status).to.equal(400);
						expect(response.body).to.be.empty;
					});
				});
				
				describe('and pull request data missing required information', function () {
					before(function (done) {
						testRequest(app)
							.post('/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132')
							.auth('username', 'password')
							.send({id: 500})
							.end(function (err, res) {
								response = res;
								done();
							})
						;
					});
					
					it('should log invalid request error', function () {
						expect(errorSpy).to.have.been.calledOnce;
						expect(errorSpy).to.have.been.calledWith('Invalid request: missing "pullrequest"');
					});
					it('should respond with invalid request', function () {
						expect(response.status).to.equal(400);
						expect(response.body).to.be.empty;
					});
				});
				
				describe('and pull request data is valid, but description is empty', function () {
					before(function (done) {
						request = function (opt, callback) {
							callback(null, {statusCode: 201});
						};
						
						var pullRequestCreated = require('./pull-request-created');
						pullRequestCreated.pullrequest.description = '';
						testRequest(app)
							.post('/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132')
							.auth('username', 'password')
							.send(pullRequestCreated)
							.end(function (err, res) {
								response = res;
								done();
							})
						;
					});
					
					it('should log success', function () {
						expect(infoSpy).to.have.been.calledOnce;
						expect(infoSpy).to.have.been.calledWith('Successfully added codeship status to pull request');
					});
					it('should respond with success', function () {
						expect(response.status).to.equal(204);
						expect(response.body).to.be.empty;
					});
				});
				
				describe('and pull request data is valid', function () {
					before(function (done) {
						request = function (opt, callback) {
							callback(null, {statusCode: 201});
						};
						
						testRequest(app)
							.post('/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132')
							.auth('username', 'password')
							.send(require('./pull-request-created'))
							.end(function (err, res) {
								response = res;
								done();
							})
						;
					});
					
					it('should log success about adding codeship status', function () {
						expect(infoSpy).to.have.been.calledOnce;
						expect(infoSpy).to.have.been.calledWith('Successfully added codeship status to pull request');
					});
					it('should respond with success', function () {
						expect(response.status).to.equal(204);
						expect(response.body).to.be.empty;
					});
				});
				
				describe('and pull request data already has codeship status', function () {
					before(function (done) {
						request = function (opt, callback) {
							callback(null, {statusCode: 201});
						};
						
						testRequest(app)
							.post('/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132')
							.auth('username', 'password')
							.send(require('./pull-request-existing'))
							.end(function (err, res) {
								response = res;
								done();
							})
						;
					});
					
					it('should log success about already having codeship status', function () {
						expect(infoSpy).to.have.been.calledOnce;
						expect(infoSpy).to.have.been.calledWith('Pull request already has codeship status');
					});
					it('should respond with success', function () {
						expect(response.status).to.equal(204);
						expect(response.body).to.be.empty;
					});
				});
			});
			
			afterEach(function () {
				infoSpy.reset();
				errorSpy.reset();
			});
		});
		
		after(function () {
			mockery.disable();
			delete process.env.BITBUCKET_USERNAME;
			delete process.env.BITBUCKET_PASSWORD;
		});
	});
});
