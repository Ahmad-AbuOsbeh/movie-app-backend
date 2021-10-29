'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// import favoriteMovieSchema
const favoriteMovieSchema = require('./moviesSchema');

//secret for jwt
const SECRET = process.env.SECRET;

// create users schema
const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteMovies: [favoriteMovieSchema],
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'writer', 'editor', 'admin'],
  },
});

// get the token for bearer auth, for every user document
users.virtual('token').get(function () {
  let tokenObject = {
    username: this.username,
  };
  return jwt.sign(tokenObject, SECRET);
});

// get capabilities for the user depending on his role
users.virtual('capabilities').get(function () {
  let acl = {
    user: ['read', 'create', 'update', 'delete'],
    writer: ['read', 'create'],
    editor: ['read', 'create', 'update'],
    admin: ['read', 'create', 'update', 'delete'],
  };
  return acl[this.role];
});

// encrypet the password before saving in DB.
users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// create static method for basic authentication
users.statics.authenticateBasic = async function (email, password) {
  const user = await this.findOne({ email });
  const valid = await bcrypt.compare(password, user.password);
  if (valid) {
    return user;
  }
  throw new Error('Invalid User');
};

// create static method for bearer authentication
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, SECRET);
    const user = this.findOne({ username: parsedToken.username });
    if (user) {
      return user;
    }
    throw new Error('User Not Found');
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = mongoose.model('users', users);
