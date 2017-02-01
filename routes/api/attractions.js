var Promise = require('bluebird');
var router = require('express').Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');


router.get('/hotels', function(req, res, next) { // /api/

  Hotel.findAll()
  .then(function(hotels) {
    res.json(hotels);
  })
  .catch(next);
});

router.get('/restaurants', function(req, res, next) { // /api/
  Restaurant.findAll()
  .then(function(restaurants) {
    res.json(restaurants);
  })
  .catch(next);

});

router.get('/activities', function(req, res, next) { // /api/
  Activity.findAll()
  .then(function(activities) {
    res.json(activities);
  })
  .catch(next);
});

module.exports = router;
