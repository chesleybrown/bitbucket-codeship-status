'use strict';

var expect = require('chai').expect;
var testRequest = require('supertest');
var mockery = require('mockery');

describe('Index', function () {
	var app, response, pullRequestCreated, request;
	
	before(function () {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false
		});
		app = undefined;
		response = undefined;
		pullRequestCreated = require('./pull-request-created');
		
		mockery.registerMock('request', function (opt, callback) {
			return request(opt, callback);
		});
		
		app = require('../app')();
	});
	
	describe('when calling an unknown url', function () {
		beforeEach(function () {
			response = testRequest(app)
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
	
	describe('when no environment set', function () {
		before(function () {
			delete process.env.BITBUCKET_USERNAME;
			delete process.env.BITBUCKET_PASSWORD;
		});
		
		describe('and accessing index page', function () {
			before(function (done) {
				request = function (opt, callback) {
					callback(true);
				};
				testRequest(app)
					.get('/')
					.end(function (err, res) {
						response = res;
						done();
					})
				;
			});
			
			it('should respond with success', function () {
				expect(response.status).to.equal(200);
			});
			it('should render', function () {
				expect(response.text).to.contain('<!DOCTYPE html>');
			});
			it('should complain about configuration', function () {
				expect(response.text).to.contain('App is running, but missing required configuration!');
				expect(response.text).to.contain('You still need to set the <span class="label label-default">BITBUCKET_USERNAME</span> ENV variable.');
				expect(response.text).to.contain('You still need to set the <span class="label label-default">BITBUCKET_PASSWORD</span> ENV variable.');
			});
		});
	});
	
	describe('when environment set', function () {
		before(function () {
			process.env.BITBUCKET_USERNAME = 'bitbucket_username';
			process.env.BITBUCKET_PASSWORD = 'bitbucket_password';
		});
		
		describe('and credentials are correct', function () {
			before(function () {
				request = function (opt, callback) {
					callback(null, {statusCode: 200});
				};
			});
			
			describe('and accessing index page', function () {
				before(function (done) {
					testRequest(app)
						.get('/')
						.end(function (err, res) {
							response = res;
							done();
						})
					;
				});
				
				it('should respond with success', function () {
					expect(response.status).to.equal(200);
				});
				it('should render', function () {
					expect(response.text).to.contain('<!DOCTYPE html>');
				});
				it('should NOT complain env', function () {
					expect(response.text).not.to.contain('You still need to set the <span class="label label-default">BITBUCKET_USERNAME</span> ENV variable.');
					expect(response.text).not.to.contain('You still need to set the <span class="label label-default">BITBUCKET_PASSWORD</span> ENV variable.');
				});
				it('should say what bitbucket username is set', function () {
					expect(response.text).to.contain('Set to <span class="label label-default">bitbucket_username</span>.');
				});
				it('should NEVER say what aws bitbucket password is set', function () {
					expect(response.text).not.to.contain('bitbucket_password');
				});
				it('should say login was successful', function () {
					expect(response.text).to.contain('App is running and has access to Bitbucket!');
				});
			});
		});
		
		describe('and credentials are wrong', function () {
			before(function () {
				request = function (opt, callback) {
					callback(true);
				};
			});
			
			describe('and accessing index page', function () {
				before(function (done) {
					testRequest(app)
						.get('/')
						.end(function (err, res) {
							response = res;
							done();
						})
					;
				});
				
				it('should respond with success', function () {
					expect(response.status).to.equal(200);
				});
				it('should render', function () {
					expect(response.text).to.contain('<!DOCTYPE html>');
				});
				it('should say login is failing', function () {
					expect(response.text).to.contain('Access to Bitbucket was denied. Are you sure the credentials are correct?');
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
