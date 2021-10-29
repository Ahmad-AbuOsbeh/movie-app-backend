'use strict';

const axios = require('axios');
require('dotenv').config();

// class for data modeling
class Movie {
  constructor(item, category) {
    this.title = item.title;
    this.description = item.overview;
    this.date = item.release_date;
    this.image = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    this.category = category;
    this.voteAverage = item.vote_average;
    this.voteCount = item.vote_count;
    this.popularity = item.popularity;
    this.cover = `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
    this.feedback = '';
  }
}

// variable for storing data to cache memory
let storedData = [];

async function fetchAllMovies(req, res) {
  // check if the data already fetched, then send the data
  if (storedData.length !== 0) {
    res.send(storedData);
  } else {
    // GET 20 OF THE MOVIES DATA
    let actionMovies;
    let fantasyMovies;
    let horrorMovies;
    let scienceFictionMovies;
    try {
      actionMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&with_genres=28`);
      fantasyMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&with_genres=14`);
      horrorMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&with_genres=27`);
      scienceFictionMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&with_genres=878`);
    } catch (error) {
      console.log(error);
      res.status(500).send(`error in getting data from the API ==> ${error.message}`);
    }

    // EXTRACT THE REQUIRED DATA
    let actionMoviesArr = actionMovies.data.results
      .map((item) => {
        return new Movie(item, 'action');
      })
      .splice(0, 20);
    let fantasyMoviesArr = fantasyMovies.data.results
      .map((item) => {
        return new Movie(item, 'fantasy');
      })
      .splice(0, 20);
    let horrorMoviesArr = horrorMovies.data.results
      .map((item) => {
        return new Movie(item, 'horror');
      })
      .splice(0, 20);
    let scienceFictionMoviesArr = scienceFictionMovies.data.results
      .map((item) => {
        return new Movie(item, 'ScienceFiction');
      })
      .splice(0, 20);

    // Array Concat All data to be sent to Explore
    let allMovies = [actionMoviesArr, fantasyMoviesArr, horrorMoviesArr, scienceFictionMoviesArr];
    storedData = allMovies;

    // 1st res
    res.send(allMovies);
  }
}

module.exports = fetchAllMovies;
