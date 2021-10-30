'use strict';

const express = require('express');

// use express Router
const authRouter = express.Router();

// import user model
const User = require('../models/usersModel');
// import Interface to contact with DB
const Interface = require('../models/Interface');
// create new instance of Interface class
const interfaceDB = new Interface(User);

// import middlewares
const basicAuth = require('../middlewares/basicAuth');
const bearerAuth = require('../middlewares/bearerAuth');
const permissions = require('../middlewares/acl');

// auth routes
authRouter.post('/signup', signUpHandler);
authRouter.post('/signin', basicAuth, signInHandler);
authRouter.put('/verify', bearerAuth, permissions('update'), verifyUserHandler);
authRouter.put('/account', bearerAuth, permissions('update'), editAccountDataHandler);
authRouter.delete('/account', bearerAuth, permissions('delete'), deleteAccountHandler);

// signup hndler
async function signUpHandler(req, res, next) {
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
    next('sign-up error', e.message);
  }
}

// sign-in handler
function signInHandler(req, res, next) {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  try {
    res.status(200).send(user);
  } catch (error) {
    next('sign-in error', e.message);
  }
}

// update account settings handler
async function editAccountDataHandler(req, res, next) {
  let id = req.user._id;
  let { username, email, password } = req.body;

  try {
    let userData = await interfaceDB.get(id);
    userData.username = username;
    userData.email = email;
    userData.password = password;
    await userData.save();
    res.status(201).send(userData);
  } catch (error) {
    next('update account settings error', error.message);
  }
}

// delete account handler
async function deleteAccountHandler(req, res, next) {
  let id = req.user._id;

  try {
    let deletedUser = await interfaceDB.delete(id);
    console.log('deletedUser', deletedUser);
    res.status(200).send(deletedUser);
  } catch (error) {
    next('delete account error', error.message);
  }
}

// verify user handler
async function verifyUserHandler(req, res, next) {
  let id = req.user._id;
  let { verified } = req.body;

  try {
    let userData = await interfaceDB.get(id);
    userData.verified = verified;
    await userData.save();
    res.status(201).send(userData);
  } catch (error) {
    next(' verify user error', error.message);
  }
}

module.exports = authRouter;
