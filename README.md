![App Logo](https://raw.githubusercontent.com/chesleybrown/bitbucket-codeship-status/master/media/logo-small.png) bitbucket-codeship-status
=========================
[![Build Status](https://travis-ci.org/chesleybrown/bitbucket-codeship-status.svg?branch=master)](https://travis-ci.org/chesleybrown/bitbucket-codeship-status)
[![Dependency Status](https://david-dm.org/chesleybrown/bitbucket-codeship-status.svg)](https://david-dm.org/chesleybrown/bitbucket-codeship-status)

Small app that will automatically update newly created pull requests in Bitbucket with the branch's Codeship build status.

![What it looks like](https://raw.githubusercontent.com/chesleybrown/bitbucket-codeship-status/master/media/screenshot.png)

# Running on Heroku

First just deploy a free instance of the app on heroku using the button then just follow the steps below. 

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

1. Create an API Key in Bitbucket for your team and use your team name as the `username` and the API Key as your `password` in the next.
1. Set `BITBUCKET_USERNAME` and `BITBUCKET_PASSWORD` ENV variables to match with the `username` and `password` above.
1. Add a Pull Request POST hook for `Create / Edit / Merge / Decline` that points to your instance of this app. The URL should look something like this:
	- `https://bitbucket-codeship-status-example.herokuapp.com/pull-request/<CODESHIP_PROJECT_UUID>/<CODESHIP_PROJECT_ID>`
	- Which would look something like this: `https://bitbucket-codeship-status-example.herokuapp.com/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132`
1. Now whenever a pull request is created, it should (almost instantly) get updated to have the Codeship Status widget in the description.

# Running Locally

Server runs on port `8000` by default, but will use the port set
on the environment variable `PORT` if set.

1. Run `npm install` for the initial setup.
1. Set `BITBUCKET_USERNAME` and `BITBUCKET_PASSWORD` ENV variables.
1. Run `npm start` to start the server.

# Tests

To execute all the tests, just run:

```
npm test
```
