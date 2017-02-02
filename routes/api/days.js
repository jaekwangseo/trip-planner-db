var Promise = require('bluebird');
var router = require('express').Router();
var db = require('../../models/_db');
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Day = require('../../models/day');


router.get('/days', function(req, res, next) {

  console.log('/days');
  //Get all days
  // Using days.number call, createDay
  Day.findAll()
  .then(function(days) {

    console.log(days)

    getAllAttractions(1)
    .then(function(attractionsForDayOne) {
      res.json({ days, attractionsForDayOne});
    })

    // let dayPromises = days.map(function(day) {
    //
    //   return getAllAttractions(day.number);
    // });
    //
    //
    // Promise.all(dayPromises)
    // .then(function(results) {
    //   res.json(results);
    // });

  })
      .catch(next)

});

router.get('/days/:num', function (req, res, next) { // /api/

  getAllAttractions(req.params.num)
  .then(function (results) {
    console.log(results);
    res.json(results);
  })
  .catch(next);

});

function getAllAttractions(dayNumber) {

  return Day.findOne({
    where: {
      number: dayNumber
    }
  })
    .then(function (day) {

      //Finding hotels
      let hotelPromise = Hotel.findOne({
        where: {
          id: day.hotelId
        }
      })

      //Finding restaurants
      let restaurantPromise = db.models.day_restaurant.findAll({
        where: {
          dayId: day.id
        }
      }).then(function (restaurantDays) {
        //Using restaurantIDs to look up restaurant table, finding all the restaurants and returning an array off promises for them
        let restaurantPromises = restaurantDays.map(function (row) {
          return Restaurant.findOne({ where: { id: row.restaurantId } })
        })
        return Promise.all(restaurantPromises)
      })

      //Finding activites
      let activityPromise = db.models.day_activity.findAll({
        where: {
          dayId: day.id
        }
      }).then(function (activityDays) {
         //Using activityIDs to look up activity table, finding all the activitys and returning an array off promises for them
        let activityPromises = activityDays.map(function (row) {
          return Activity.findOne({ where: { id: row.activityId } })
        })
        return Promise.all(activityPromises)
      })
      //Returning the promises for all three searches
      return Promise.all([hotelPromise, restaurantPromise, activityPromise])
    })
    // .then(function (results) {
    //   console.log(results);
    //   res.json(results);
    // })

}


router.delete('/days/:num', function(req, res, next){
  // Delete restaurnt associations
  // Delete activity asscoiates
  // Delete day row
  Day.findOne({
    where: {
      number: req.params.num
    }
  })
  .then(function(day) {
    db.models.day_restaurant.destroy({
      where: {
        dayId: day.id
      }
    })
    .catch(next);

    db.models.day_activity.destroy({
      where: {
        dayId: day.id
      }
    })
    .catch(next);

    Day.destroy({
      where: {
        id: day.id
      }
    })
    .catch(next);

  })
  .then(function() {
    res.json({message: 'Day deleted successfully'});
  })
  .catch(next);
})


// Create a new day
router.post('/days/:num', function (req, res, next) { // /api/

  //Get hotel
  //using day number, get hotel id
  //look up hotel table
  Day.create(
    {
      number: req.params.num
    }
  )
    .then(function (newRow) {
      console.log("New row", newRow);
      console.log("Day created.");
      res.json({ newRow, success: true });
    })
    .catch(next);

});

router.post('/days/:num/hotels/:hotelId', function (req, res, next) { // /api/

  //Get hotel
  //using day number, get hotel id
  //look up hotel table
  Day.findOrCreate(
    {where: {
      number: req.params.num
    },
    defaults: {
      hotelId: req.params.hotelId
      }
    })
    .then(function (newRowArray, created) {
      console.log(newRowArray);
      let newRow = newRowArray[0];
      if (!created){
        console.log("Found row to update: ", newRow.id);
        Day.update({hotelId: req.params.hotelId},
        {where:{ id: newRow.id }, returning: true }
        )
        .then(function (result){
          console.log("Rows updated:", result);
          res.json(result)
        })
      }
      else {
        res.json(newRow);
      }
    })
    .catch(next);
});


router.delete('/days/:num/hotels/:hotelId', function (req, res, next) { // /api/

  //Get hotel
  //using day number, get hotel id
  //look up hotel table
  Day.update(
    {
      hotelId: null
    },
    {
      where: {
        number: req.params.num,
        hotelId: req.params.hotelId
      },
      returning: true
    }
  )
    .then(function (updatedRow) {
      console.log("Hotel ID set to null", updatedRow);
      res.json({ updatedRow, success: true });
    })
    .catch(next);
});


router.post('/days/:num/restaurants/:restaurantId', function (req, res, next) { // /api/


  //Get restaurants
  //using day number get day id.
  //use day id, get all restaurant ids that's associated with day id
  //look up in restaurant table
  Day.find({
    where: {
      number: req.params.num
    }
  })
    .then(function (day) {
      return db.models.day_restaurant.create(
        {
          dayId: day.id,
          restaurantId: req.params.restaurantId
        }
      )
    })
    .then(function (newRestaurant) {
      console.log('Restaurant updated.');
      res.json({ newRestaurant, success: true });
    })
    .catch(next);

});


router.delete('/days/:num/restaurants/:restaurantId', function (req, res, next) { // /api/

  //Get hotel
  //using day number, get hotel id
  //look up hotel table
  Day.find({
    where: {
      number: req.params.num
    }
  })
    .then(function (day) {
      console.log("day id:", day.id)
      return db.models.day_restaurant.destroy({
        where: {
          dayId: day.id,
          restaurantId: req.params.restaurantId
        }
      })
    })
    .then(function (deletedRow) {
      console.log("Destroyed row", deletedRow);
      console.log("Restaurant removed from day.");
      res.json({ deletedRow, success: true });
    })
    .catch(next);
});




router.post('/days/:num/activities/:activityId', function (req, res, next) { // /api/


  //Get restaurants
  //using day number get day id.
  //use day id, get all restaurant ids that's associated with day id
  //look up in restaurant table
  Day.find({
    where: {
      number: req.params.num
    }
  })
    .then(function (day) {
      return db.models.day_activity.create(
        {
          dayId: day.id,
          activityId: req.params.activityId
        }
      )
    })
    .then(function (newActivity) {
      console.log('Activity updated.');
      res.json({ newActivity, success: true });
    })
    .catch(next);

});


router.delete('/days/:num/activities/:activityId', function (req, res, next) { // /api/

  //Get hotel
  //using day number, get hotel id
  //look up hotel table
  Day.find({
    where: {
      number: req.params.num
    }
  })
    .then(function (day) {
      console.log("day id:", day.id)
      return db.models.day_activity.destroy({
        where: {
          dayId: day.id,
          activityId: req.params.activityId
        }
      })
    })
    .then(function (deletedRow) {
      console.log("Destroyed row", deletedRow);
      console.log("Activity removed from day.");
      res.json({ deletedRow, success: true });
    })
    .catch(next);
});

module.exports = router;
