'use strict';

const User = require('../models/usersModel');

// export bearer auth middleware
module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      errorByAuthentication();
    }

    console.log('req.headers', req.headers);

    const token = req.headers.authorization.split(' ').pop();

    // check the token with the original one by the username & the SECRET
    const validUser = await User.authenticateWithToken(token);

    console.log('token,validUser', token, validUser);
    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch (e) {
    errorByAuthentication();
  }

  // error handler for invalid token
  function errorByAuthentication() {
    next('Invalid Token');
  }
};
