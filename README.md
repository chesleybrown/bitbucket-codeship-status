![App Logo](https://raw.githubusercontent.com/chesleybrown/bitbucket-codeship-status/master/media/logo-small.png)
bitbucket-codeship-status
=========================
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
[![Build Status](https://travis-ci.org/chesleybrown/bitbucket-codeship-status.svg?branch=master)](https://travis-ci.org/chesleybrown/bitbucket-codeship-status)

Small app that will automatically update newly created pull requests in Bitbucket with the branch's Codeship build status.

![What it looks like](https://raw.githubusercontent.com/chesleybrown/bitbucket-codeship-status/master/media/screenshot.png)

# Setup

Just need to install the node modules:

1. `npm install`
1. Create an API Key for your team and user your team name as the `username` and the API Key as your `password` in the next step
1. Set `BITBUCKET_USERNAME` and `BITBUCKET_PASSWORD` ENV variables match with the `username` and `password` above
1. Add a Pull Request POST hook for `Create / Edit / Merge / Decline` that points to your instance of this app. The URL should look something like this:
	- `https://bitbucket-codeship-status-example.herokuapp.com/pull-request/<CODESHIP_PROJECT_GUID>/<CODESHIP_PROJECT_ID>`
	- Which would look something like this: `https://bitbucket-codeship-status-example.herokuapp.com/pull-request/ee1399cc-b740-43da-812f-d17901f9efa7/52132`
1. Now whenever a pull request is created, it should (almost instantly) get updated to have the Codeship Status widget in the description.

# Running

Server runs on port `8000` by default, but will use the port set
on the environment variable `PORT` if set.
To start the server, just run:

```
npm start
```

# Tests

To execute all the tests, just run:

```
npm test
```
