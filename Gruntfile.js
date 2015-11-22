'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		tabs4life: {
			app: {
				options: {
					jshint: {
						mocha: true
					}
				},
				src: [
					'.gitignore',
					'app.js',
					'app.json',
					'Gruntfile.js',
					'Procfile',
					'README.md',
					'LICENSE',
					'views/**/*.html',
					'test/**/*.js',
					'test/**/*.json'
				]
			}
		}
	});
	
	grunt.registerTask('test', ['tabs4life:app']);
	grunt.registerTask('default', ['test']);
};
