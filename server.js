'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const ejs = require('ejs');
const pg = require('pg');
const methodOverride = require('method-override');

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

// Middleware to handle PUT and DELETE
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in urlencoded POST bodies and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

//load index
app.get('/', loadIndex);

//Similar Artists Route
app.post('/search-results', loadSimilarArtists);

//Load events route
app.get('/button', loadEvents);

// app.get('/bands/:bandname', loadEvents);
app.post('/bands/:bandname', loadSingleEvent);
app.get('/bandevents/:bandname', loadBandEvents);

//show saved events
app.get('/saved', getEvents);

//Add event to Database
app.post('/add', addToMyEvents);

//Delete event from Database
app.post('/delete/:event_id', deleteEvent);

//Server listening to requests on PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

//Error handler
function handleError(error, response){
  response.render('pages/error');
}
// Catch-all route that renders the error page
app.get('*', (request, response) => response.status(404).render('pages/error'));


//Constructor Functions

function Band(info){
  this.bandname = info.Name;
  this.description = info.wTeaser;
  this.video = info.yUrl;
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
  let url = `https://tastedive.com/api/similar?q=${request.body.search}&type=music&limit=20&info=1&k=${process.env.TASTE_DIVE_API_KEY}`

  superagent.get(url)
    .then(results => results.body.Similar.Results.map(bandResults => new Band(bandResults)))
    // .then(results => console.log(results))
    .then(results => {
      response.render('pages/searches/show', { searchResults: results });
    })
    .catch(err => handleError(err, response));
}
// Events route handler
function loadEvents(request, response){
  let url = `https://app.ticketmaster.com/discovery/v2/events.json?classifficationName=music&keyword=${request.params.bandname}&apikey=${process.env.TICKETMASTER_API_KEY}`

  superagent.get(url)
    .then(results => results.body._embedded.events.map(eventResults => new Event(eventResults)))
    .then(results => {
      response.render('pages/events/show',{eventResults: results})
    })
    .catch(console.error('No upcoming Events'));
}

function getEvents(request, response ) {
  console.log(1);
  const SQL =`SELECT * FROM events`;
  console.log(SQL);
  return client.query(SQL)
    .then(result => {
      response.render('pages/events/saved', {header:`My events(${result.rows.length})`, eventResults: result.rows})
    })
    .catch(err => handleError(err, response));
}

function addToMyEvents(request, response) {
  console.log(request.body);
  let {eventName, eventURL, image, date, startTime, venue} = request.body;

  let SQL = 'INSERT INTO events(event_name, event_url, image, date, start_time, venue) VALUES ($1, $2, $3, $4, $5, $6);';
  let values = [eventName, eventURL, image, date, startTime, venue];

  return client.query(SQL, values)
    .then(response.redirect('/saved'))
    .catch(err => handleError(err, response));
}

function loadBandEvents(request, response){
  console.log('LOAD BAND EVENTS');
  let url = `https://app.ticketmaster.com/discovery/v2/events.json?classifficationName=music&keyword=${request.params.bandname}&apikey=${process.env.TICKETMASTER_API_KEY}`

  superagent.get(url)
    .then(results => {
      const eventsSummary = results.body._embedded.events;
      const eventObjects = eventsSummary.map(event => new Event(event));
      response.send(eventObjects);
    })
    .catch(err=>console.error(err));
}

function loadSingleEvent(request, response){
  console.log(request.body);
  response.render('pages/events/show', {eventResults: request.body});
}
function deleteEvent(request, response){
  let SQL = `DELETE FROM events WHERE id=$1;`;
  let values = [request.params.event_id];

  client.query(SQL, values)
    .then(response.redirect('/saved'))
    .catch(err => handleError(err, response));

}
