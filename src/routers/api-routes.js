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
async function handleGetFav(req, res, next) {
  try {
    let id = req.user._id;
    let allRecords = await interfaceDB.get(id);
    res.status(200).send(allRecords);
  } catch (error) {
    next('get favourites error', error.message);
  }
}

// add Favourt handler
async function handleAddToFav(req, res, next) {
  let id = req.user._id;
  let obj = req.body;

  try {
    let userData = await interfaceDB.get(id);
    userData.favoriteMovies.push(obj);
    await userData.save();
    res.status(201).send(userData);
  } catch (error) {
    next('add favourite error', error.message);
  }
}

// delete Favourt handler
async function handleDeleteFromFav(req, res, next) {
  const userId = req.user._id;
  const { id } = req.params;
  try {
    let userData = await interfaceDB.get(userId);
    const updatedFavourite = userData.favoriteMovies.filter((item) => item._id != id);
    userData.favoriteMovies = updatedFavourite;
    await userData.save();

    res.status(200).send(userData);
  } catch (error) {
    next('delete favourite error', error.message);
  }
}

module.exports = router;
