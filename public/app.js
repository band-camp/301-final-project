'use strict'

$('button').click(function() {
  let fullBandName = this.className;
  let bandName = this.className.replace(/\s?\+?\!?\&?\'?/g, '');
  $(`#${bandName}`).empty();
  $(`#${bandName}`).append('<li>No Upcoming Events!</li>');
  // AJAX request - get events data for artist
  $.ajax({
    url: `/bandevents/${this.className}`,
    method: 'GET',
    data: {data: this.className}
  })
    .then(result => {
      console.log(result);
      console.log('RESULT LENGTH______', result.length);

      $(`#${bandName}`).empty();
      result.forEach(obj => $(`#${bandName}`)
        .append(`<li class="event-name">${obj.eventName} </li>
        <li class="event-date">${obj.date}</li>
        <li class="event-date">${obj.city}, ${obj.state}</li>

        <form action="/bands/${fullBandName}" method="post">
        <fieldset>
          <input type="text" name="eventName" value="${obj.eventName}" hidden/>
          <input type="text" name="eventURL" value="${obj.eventURL}" hidden/>
          <input type="text" name="image" value="${obj.image}" hidden/>
          <input type="text" name="date" value="${obj.date}" hidden>
          <input type="text" name="startTime" value="${obj.startTime}" hidden>
          <input type="text" name="venue" value="${obj.venue}" hidden>
          <input type="text" name="city" value="${obj.city}" hidden>
          <input type="text" name="state" value="${obj.state}" hidden>
          <button id="${obj.date}" type="submit" class="choose-button">${'Event Details'}</button>
        </fieldset>
      </form>`));

    }
    )

  $(`#${bandName}`).toggle(300);
});



