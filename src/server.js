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

// import error & not found handler
const errorHandler = require('./middlewares/500');
const notFound = require('./middlewares/404');

// import the routers
const authRoutes = require('./routers/auth-routes');
const apiRoutes = require('./routers/api-routes');

// use routes
app.use('/', authRoutes);
app.use('/', apiRoutes);

// proof of life
app.get('/', (req, res) => {
  res.send('Home server route');
});

// use error & not found handlers
app.use('*', notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`up and running on ${port}`);
    });
  },
};
