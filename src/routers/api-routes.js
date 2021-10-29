'use strict';

const express = require('express');

// import getAllMoviesHandler
const getAllMoviesHandler = require('../API/API.controller');

// import Interface to contact with DB
const Interface = require('../models/Interface');

// import user model
const userModel = require('../models/usersModel');

// create new instance of Interface class
const interfaceDB = new Interface(userModel);

// access control list middleware
const permissions = require('../middlewares/acl');

// bearer auth middleware
const bearerAuth = require('../middlewares/bearerAuth');

// use express Router
const router = express.Router();

// user routes
router.get('/movies', getAllMoviesHandler);
router.get('/favourites', bearerAuth, permissions('read'), handleGetFav);
router.post('/favourite', bearerAuth, permissions('create'), handleAddToFav);
router.delete('/favourite/:id', bearerAuth, permissions('delete'), handleDeleteFromFav);

// get all favourites handler
async function handleGetFav(req, res) {
  let id = req.user._id;
  let allRecords = await interfaceDB.get(id);
  res.status(200).send(allRecords);
}

// create Favourt handler
async function handleAddToFav(req, res) {
  let id = req.user._id;
  let obj = req.body;
  let userData = await interfaceDB.get(id);

  userData.favoriteMovies.push(obj);
  userData.save();
  res.status(201).send(userData);
}

// delete Favourt handler
async function handleDeleteFromFav(req, res) {
  const userId = req.user._id;
  const { id } = req.params;
  console.log('id', id);
  let userData = await interfaceDB.get(userId);
  const updatedFavourite = userData.favoriteMovies.filter((item) => item._id != id);
  userData.favoriteMovies = updatedFavourite;
  userData.save();

  res.status(200).send(userData);
}

module.exports = router;
