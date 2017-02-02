

var hotels = [];// = {{ templateHotels | dump | safe }};
var restaurants = [];// = {{ templateRestaurants | dump | safe }};
var activities = [];// = {{ templateActivities | dump | safe }};


var APICALL = (function () {

  // application state


  // globally accessible module methods

  var publicAPI = {

    loadDays: function() {
      return $.get('/api/days')
          .then(function (results) {
            console.log('ajax called', results);
            return results;
          })
          .catch(console.error.bind(console));

    }

  };

  return publicAPI;

}());