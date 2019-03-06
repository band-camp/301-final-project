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
const PORT = process.env.PORT || 8080;

//PG instantiation
const client = new pg.Client(process.env.DATABASE_URL)
client.connect();
client.on('error', err => console.error(err));

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

//Add event to Database
app.post('/add', addToMyEvents);

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
  this.image = info.images[0].url;
  this.date = info.dates.start.localDate;
  this.startTime = info.dates.start.localTime;
  this.venue = info._embedded.venues[0].name;
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
  let url = `https://app.ticketmaster.com/discovery/v2/events.json?classifficationName=music&keyword=${request.params.bandname}&apikey=${process.env.TICKETMASTER_API_KEY}`

  superagent.get(url)
    .then(results => results.body._embedded.events.map(eventResults => new Event(eventResults)))
    .then(results => {
      response.render('pages/events/show',{eventResults: results})
    })
}

function addToMyEvents(request, response) {
  console.log(request.body);
  let {eventName, eventURL, image, date, startTime, venue} = request.body;

  let SQL = 'INSERT INTO events(event_name, event_url, image, date, start_time, venue) VALUES ($1, $2, $3, $4, $5, $6);';
  let values = [eventName, eventURL, image, date, startTime, venue];

  return client.query(SQL, values)
    .then(response.redirect('/'))
    // .catch(err => handleError(err, response));
}

