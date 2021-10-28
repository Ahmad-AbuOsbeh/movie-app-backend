'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// create the schema
const favoriteMovieSchema = new Schema({
  title: String,
  description: String,
  date: String,
  image: String,
  type: String,
  category: String,
  voteAverage: String,
  voteCount: String,
  popularity: String,
  cover: String,
  feedback: { type: String, default: 'test' },
});

module.exports = favoriteMovieSchema;
