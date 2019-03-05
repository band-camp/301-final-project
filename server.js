'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const ejs = require('ejs');
const pg = require('pg');

// Environment Variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Application Middleware
app.use(express.urlencoded({ extended: true }));

// Set the file locations for ejs templates and static files like CSS
app.set('view engine', 'ejs');
app.use(express.static('./public'));

//load index
app.get('/', loadIndex);

//Similar Artists Route
app.post('/search-results', loadSimilarArtists);

//Load events route
app.get('/button', loadEvents);


app.get('/bands/:bandname', loadEvents);

//Server listening to requests on PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}`));


//Ticketmaster Route

// Catch-all route that renders the error page
app.get('*', (request, response) => response.status(404).render('pages/error'));

function Band(info){
  this.bandname = info.Name;
}

function Event(info){
  this.eventName = info.name;
  this.eventURL = info.url;
  this.image = info.images.url;
  this.date = info.dates.start.localDate;
  this.startTime = info.dates.start.localTime;
}

function loadIndex(request, response) {
  response.render('index');
  app.use(express.static('./public'));
}

// Searches route handler
function loadSimilarArtists(request, response) {
  let url = `https://tastedive.com/api/similar?q=${request.body.search}&type=music&limit=9&k=${process.env.TASTE_DIVE_API_KEY}`

  superagent.get(url)
    .then(results => results.body.Similar.Results.map(bandResults => new Band(bandResults)))
    .then(results => {
      response.render('pages/searches/show', { searchResults: results });
    })
}
// Events route handler
function loadEvents(request, response){
  let url = `https://app.ticketmaster.com/discovery/v2/events.json?classifficationName=music&postalCode=98121&keyword=${request.params.bandname}&apikey=${process.env.TICKETMASTER_API_KEY}`

  superagent.get(url)
    .then(results => console.log(results))
    // .then(results => results.body._embedded.events.map(eventResults => new Event(eventResults)))
    // .then(results => {
      // response.render('pages/events/show',{eventResults: results})
    // })
}
