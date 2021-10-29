'use strict';

// import base64 library
const base64 = require('base-64');

const User = require('../models/usersModel');

// export basic auth middleware
module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return errorByAuthentication();
  }

  let basic = req.headers.authorization.split(' ').pop();

  // get original username & passowrd
  let [user, pass] = base64.decode(basic).split(':');

  try {
    // check the username & password with original ones in DB
    req.user = await User.authenticateBasic(user, pass);
    next();
  } catch (e) {
    errorByAuthentication();
  }

  // error handler for invalid token
  function errorByAuthentication() {
    next('Invalid Token');
  }
};
