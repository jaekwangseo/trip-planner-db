

var hotels = [];// = {{ templateHotels | dump | safe }};
var restaurants = [];// = {{ templateRestaurants | dump | safe }};
var activities = [];// = {{ templateActivities | dump | safe }};



$.get('/api/restaurants')
.then(function (dbrestaurants) {
  restaurants = dbrestaurants;
})

$.get('/api/activities')
.then(function (dbactivities) {
  activities = dbactivities;
})

