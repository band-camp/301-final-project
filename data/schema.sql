DROP TABLE events;

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(255),
  event_url VARCHAR(255),
  image VARCHAR(255),
  date VARCHAR(255),
  start_time VARCHAR(255),
  venue VARCHAR(255)
);