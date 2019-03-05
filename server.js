'use strict';

//Dependencies

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');

//Application setup
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.static('./public'));
app.set('view engine', 'ejs');

//Database setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//Similar Artists Route
app.post('/search-results', loadSimilarArtists);

//Server listening to requests on PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}`));


//Ticketmaster Route

// Catch-all route that renders the error page
app.get('*', (request, response) => response.status(404).render('pages/error'));

function Band(info){
  this.bandname = info.results.name;
}

// Searches route handler
function loadSimilarArtists(request, response) {
  let url = `https://tastedive.com/api/similar?q=${request.body.search}&type=music&limit=9&k=${process.env.TASTE_DIVE_API_KEY}`

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Band(bookResult.volumeInfo)))
    .then(results => {
      response.render('pages/searches/show', { searchesResults: results });
    })
}

