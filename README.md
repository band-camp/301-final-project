# 301-final-project
Music events application that finds similar artists playing nearby.

# Project Name:
  BANDWAGON
# Team:
[__Band Camp__](https://github.com/band-camp) - ![CF](http://i.imgur.com/7v5ASc8.png) [__Vanessa Wei__](http://github.com/Wei9023), [__Aaron Ferris__](https://github.com/abferris), [__Chris Morton__](https://github.com/cmorto02), [__Cory Henderson__](http://github.com/cory0s)
# Description:
This project lets the user input a band they like, and provides nearby live music events for similar artists.
# Problem domain:
People are always looking to find new music.  Sometimes committing to going to a live music event is hard because the user may not like the type of music which they bought tickets to.  This app increases the likelihood of a user finding a new band/event which they will enjoy.

# Libraries, frameworks, packages:
__Javascript, HTML, SQL, CSS, Express, Postgresql, Superagent, JQuery, EJS, MethodOverride, Dotenv, Nodemon, Photoshop__

# Instructions:
  In Order to run this page from the github files, you will need to do the following:\
  -Acquire a __tastedive__ and __ticketmaster__ API key in order to send out requests\
    *tastedive api can be acquired at https://tastedive.com/account/api_access\
    *ticketmaster api can be acquired at https://developer-acct.ticketmaster.com/user/13807/edit\
  -Create a __.env__ file, its contents with the following:\
    *PORT=3000\
    *TASTE_DIVE_API_KEY=(Insert TasteDive API key)\
    *TICKETMASTER_API_KEY=(insert TicketMaster API key)\
    *DATABASE_URL=postgres://localhost:5432/myevents\
  -Create __EJS__ Database named myevents\ 
  -using the __schema.sql__ inside the data folder create table\
    *example command: _psql -f schema.sql -d myevents_\
  -install the following libraries using _npm i_:\
    *__dotenv__\
    *__express__\
    *__methodoveride__\
    *__superagent__\
    *__ejs__\
    *__pg__\
  -use _nodemon_, or if you do not have it and do not care to download nodemon, 'live-server' to run the application\
  -access the page through _localhost:3000_ or replace _3000_ with whichever port you are running\


# API Endpoints:
  Tastedive:\
    *Format: _https://tastedive.com/api/similar?q=$(name)&type=music&limit=20&info=1&k=(APIkey)_\
    *Sample Call: _https://tastedive.com/api/similar?q=$Green+Day&type=music&limit=20&info=1&k=(APIkey)_\
    *Sample Response:\
    ```{"Similar": {
        "Info": [
            {
                "Name": "Green Day",
                "Type": "music",
                "wTeaser": "\n\nGreen Day is an American rock band ...
                "wUrl": "http://en.wikipedia.org/wiki/Green_Day",
                "yUrl": "https://www.youtube-nocookie.com/embed/Soa3gO7tL-c",
                "yID": "Soa3gO7tL-c"
            }
        ],
        "Results": [
            {
                "Name": "Billie Joe Armstrong",
                "Type": "music",
                "wTeaser": "\n\nBillie Joe Armstrong (born February 17, 1972) is an American singer...
                "wUrl": "http://en.wikipedia.org/wiki/Billie_Joe_Armstrong",
                "yUrl": "https://www.youtube-nocookie.com/embed/x6FIThATT50",
                "yID": "x6FIThATT50"
            },
    }```

  TicketMaster\
    * Format: _https://app.ticketmaster.com/discovery/v2/events.json?name=(BandName)&apikey=(APIKEY)_\
    * Sample Call: _https://app.ticketmaster.com/discovery/v2/events.json?name=Green+Day&apikey=(APIKEY)_\
    * Sample Response:\
      ```{ "_embedded": {
          "events": [
            {
              "name": "P!nk: Beautiful Trauma World Tour",
              "type": "event",
              "id": "vvG1VZ4amWNHAC",
              "test": false,
              ...
      ```

# Accreditation
Wagon icon: https://svgsilh.com/image/48633.html
svgsilh released under Creative Commons CC0
image created from website pixabay https://pixabay.com/vectors/wagon-pioneer-caravan-covered-old-48633/ from user Clker-Free-Vector-Images. 

Search icon: https://www.maxpixel.net/Magnifier-User-Logo-Theme-Icons-Icon-Www-1787362 
From website Max Pixel, labeled for commercial reuse.

Broken Wagon image: https://rockyone.smugmug.com/Machines/Farming-Australia-The-backbone/i-MkKKJmt
From website SmugMug.com user Rockyone For educational use.

Abbey Road Cover: Owned by the Beatles. From biography.com. Noncommercial educational copyright.
