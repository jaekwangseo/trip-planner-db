'use strict';
/* global $ dayModule */

/**
 * A module for managing multiple days & application state.
 * Days are held in a `days` array, with a reference to the `currentDay`.
 * Clicking the "add" (+) button builds a new day object (see `day.js`)
 * and switches to displaying it. Clicking the "remove" button (x) performs
 * the relatively involved logic of reassigning all day numbers and splicing
 * the day out of the collection.
 *
 * This module has four public methods: `.load()`, which currently just
 * adds a single day (assuming a priori no days); `switchTo`, which manages
 * hiding and showing the proper days; and `addToCurrent`/`removeFromCurrent`,
 * which take `attraction` objects and pass them to `currentDay`.
 */

var tripModule = (function () {

  // application state

  var days = [],
      currentDay;

  // jQuery selections

  var $addButton, $removeButton;
  $(function () {
    $addButton = $('#day-add');
    $removeButton = $('#day-title > button.remove');
  });

  // method used both internally and externally

  function switchTo (newCurrentDay) {
    if (currentDay) currentDay.hide();
    currentDay = newCurrentDay;
    currentDay.show();
  }

  // jQuery event binding

  $(function () {
    $addButton.on('click', addDay);
    $removeButton.on('click', deleteCurrentDay);
  });

  function addDay () {
    if (this && this.blur) this.blur(); // removes focus box from buttons
    var newDay = dayModule.create({ number: days.length + 1 }); // dayModule
    days.push(newDay);
    if (days.length === 1) {
      currentDay = newDay;
    }
    switchTo(newDay);
  }

  function deleteCurrentDay () {
    // prevent deleting last day
    if (days.length < 2 || !currentDay) return;
    // remove from the collection
    var index = days.indexOf(currentDay),
      previousDay = days.splice(index, 1)[0],
      newCurrent = days[index] || days[index - 1];
    // fix the remaining day numbers
    days.forEach(function (day, i) {
      day.setNumber(i + 1);
    });
    switchTo(newCurrent);
    previousDay.hideButton();
  }

  // globally accessible module methods

  var publicAPI = {

    load: function () {

      console.log('loading stuff!!!')

      let results = APICALL.loadDays();
      results.then(function(results) {

        let days = results.days;
        let attractionsForDayOne = results.attractionsForDayOne;

        days.forEach(function() {
          $(addDay);
        })

        let hotel = attractionsForDayOne[0];
        let restaurants = attractionsForDayOne[1];
        let activities = attractionsForDayOne[2];

        hotel = attractionsModule.getEnhanced(hotel);
        restaurants = restaurants.map(function(rest) {
          return attractionsModule.getEnhanced(rest)
        });
        activities = activities.map(function(activity) {
          return attractionsModule.getEnhanced(activity)
        })

        let dayOne = days.filter(function(day) {
          return day.number === 1;
        })
        let dayOneInstance = dayModule.create(dayOne);

        dayOneInstance.addAttraction(hotel);
        restaurants.forEach(function(rest) {
          dayOneInstance.addAttraction(rest);
        })
        activities.forEach(function(activity) {
          dayOneInstance.addAttraction(activity);
        })
      })


      // tripModule.switchTo()
      

    },

    switchTo: switchTo,

    addToCurrent: function (attraction) {
      currentDay.addAttraction(attraction);
    },

    removeFromCurrent: function (attraction) {
      currentDay.removeAttraction(attraction);
    }

  };

  return publicAPI;

}());
