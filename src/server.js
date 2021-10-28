'use strict';

// import express and cors
const express = require('express');
const cors = require('cors');

// create the express app
const app = express();

// use CORS
app.use(cors());
// allow json on requests
app.use(express.json());

// proof of life
app.get('/', (req, res) => {
  res.send('Home server route');
});

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`up and running on ${port}`);
    });
  },
};
