bitbucket-codeship-status
=========================
[![Build Status](https://travis-ci.org/chesleybrown/bitbucket-codeship-status.svg?branch=master)](https://travis-ci.org/chesleybrown/bitbucket-codeship-status)

Small app that will automatically update newly created pull requests in Bitbucket with the branch's Codeship build status.

# Setup

Just need to install the node modules:

1. `npm install`
1. Create an API Key for your team and user your team name as the `username` and the API Key as your `password` in the next step
1. Set `BITBUCKET_USERNAME` and `BITBUCKET_PASSWORD` ENV variables

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