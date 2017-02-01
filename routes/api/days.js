var Promise = require('bluebird');
var router = require('express').Router();
var db = require('../../models/_db');
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Day = require('../../models/day');


router.get('/days/:num/hotels', function(req, res, next) { // /api/

  //Get hotel
  //using day number, get hotel id
  //look up hotel table
  Day.findOne({
    where: {
      number: req.params.num
    }
  })
  .then(function(day) {
    return day.hotelId;
  })
  .then(function(hotelId) {
    return Hotel.findOne({
      where: {
        id: hotelId
      }
    })
  })
  .then(function(hotel) {
    res.json(hotel);
  })

  //Get restaurants
  //using day number get day id.
  //use day id, get all restaurant ids that's associated with day id
  //look up in restaurant table


});

router.get('/days/:num/restaurants', function(req, res, next) { // /api/


  //Get restaurants
  //using day number get day id.
  //use day id, get all restaurant ids that's associated with day id
  //look up in restaurant table
  Day.findOne({
    where: {
      number: req.params.num
    }
  })
  .then(function(day) {
    return day.id;
  })
  .then(function(dayid) {
    //console.log(db);
    return db.models.day_restaurant.findAll({
      where: {
        dayId: dayid
      }
    })
  })
  .then(function(restaurantResults) {
    console.log(restaurantResults[0].restaurantId)
    res.json({})
  })

});

module.exports = router;
