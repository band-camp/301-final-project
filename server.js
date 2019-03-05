//Dependencies
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.static('./public'));
app.set('view engine', 'ejs');

//Database setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//Routes
app.get('hello', proofOfLife);








//Server listening to requests on PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
