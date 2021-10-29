'use strict';

const express = require('express');

// use express Router
const authRouter = express.Router();

// import user model
const User = require('../models/usersModel');

// import middlewares
const basicAuth = require('../middlewares/basicAuth');
const bearerAuth = require('../middlewares/bearerAuth');
const permissions = require('../middlewares/acl');

// "/signup" route, and its callback function
authRouter.post('/signup', async (req, res, next) => {
  try {
    // create new user object
    let user = new User(req.body);

    // save user object
    const userRecord = await user.save();

    // get the user object and its token
    const output = {
      user: userRecord,
      token: userRecord.token,
    };

    // return the object and token to the client
    res.status(201).send(output);
  } catch (e) {
    next(e.message);
  }
});

// "/signin" route, and its callback function and basic auth middleware
authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.status(200).send(user);
});

module.exports = authRouter;
