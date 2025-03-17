/**
 * NHS Prototype Kit - Date and Time Filters
 * 
 * This file contains Nunjucks filters for formatting dates and times
 * in line with the NHS digital service standards.
 */

const moment = require('moment')

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks.
   * @type {Object}
   */
  const filters = {}

  /* ------------------------------------------------------------------
    Helper functions
  ------------------------------------------------------------------ */

  // Helper function to get a proper moment object from various inputs
  const getMomentObject = (timestamp) => {
    if (!timestamp) return moment(); // Default to now
    
    // Handle string date representations
    if (typeof timestamp === 'string') {
      // Handle special date terms
      if (timestamp.toLowerCase() === 'now') return moment();
      if (timestamp.toLowerCase() === 'today') return moment();
      if (timestamp.toLowerCase() === 'tomorrow') return moment().add(1, 'days');
      if (timestamp.toLowerCase() === 'yesterday') return moment().subtract(1, 'days');
      
      // Check if it's a valid ISO or RFC2822 format
      const date = moment(timestamp);
      if (date.isValid()) return date;
      
      // If we can't parse it, return current date
      return moment();
    }
    
    // Handle moment objects
    if (moment.isMoment(timestamp)) return timestamp;
    
    // Handle Date objects and other inputs
    const date = moment(timestamp);
    return date.isValid() ? date : moment(); // Return now if invalid
  }

  /* ------------------------------------------------------------------
    Date formatting filters
  ------------------------------------------------------------------ */

  // Format a date in the standard NHS date format (1 January 2023)
  filters.nhsDate = function(timestamp) {
    const date = getMomentObject(timestamp);
    return date.format('D MMMM YYYY');
  }

  // Format a date in a shorter format (1 Jan 2023)
  filters.nhsShortDate = function(timestamp) {
    const date = getMomentObject(timestamp);
    return date.format('D MMM YYYY');
  }

  // Format a date in numeric format (01/01/2023)
  filters.nhsNumericDate = function(timestamp) {
    const date = getMomentObject(timestamp);
    return date.format('DD/MM/YYYY');
  }

  // Format a date with day name (Monday 1 January 2023)
  filters.nhsDateWithDay = function(timestamp) {
    const date = getMomentObject(timestamp);
    return date.format('dddd D MMMM YYYY');
  }

  // Format a date with time (1 January 2023 at 14:30)
  filters.nhsDateTime = function(timestamp) {
    const date = getMomentObject(timestamp);
    return date.format('D MMMM YYYY [at] HH:mm');
  }

  // Format just the time (14:30)
  filters.nhsTime = function(timestamp) {
    const date = getMomentObject(timestamp);
    return date.format('HH:mm');
  }

  // Format time with am/pm (2:30pm)
  filters.nhsTime12Hour = function(timestamp) {
    const date = getMomentObject(timestamp);
    return date.format('h:mma').toLowerCase();
  }

  // Format a date as relative time (today, yesterday, 2 days ago)
  filters.nhsRelativeDate = function(timestamp) {
    const date = getMomentObject(timestamp);
    const now = moment();
    
    if (date.isSame(now, 'day')) {
      return 'Today';
    } else if (date.isSame(now.clone().subtract(1, 'days'), 'day')) {
      return 'Yesterday';
    } else if (date.isAfter(now.clone().subtract(7, 'days'))) {
      return date.from(now);
    } else {
      return date.format('D MMMM YYYY');
    }
  }

  // Format a duration in hours and minutes (1 hour 30 minutes)
  filters.nhsDuration = function(minutes) {
    // Handle non-numeric inputs
    if (minutes === undefined || minutes === null || isNaN(parseInt(minutes))) {
      return '0 minutes';
    }
    
    // Convert to a number if it's a string
    const mins = parseInt(minutes);
    
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    let result = '';
    if (hours > 0) {
      result += hours + ' ' + (hours === 1 ? 'hour' : 'hours');
    }
    
    if (remainingMins > 0) {
      if (result.length > 0) result += ' ';
      result += remainingMins + ' ' + (remainingMins === 1 ? 'minute' : 'minutes');
    }
    
    if (result.length === 0) {
      result = '0 minutes';
    }
    
    return result;
  }
  
  // Return date for NHS appointment lists (Today, Tomorrow, or formatted date)
  filters.nhsAppointmentDate = function(timestamp) {
    const date = getMomentObject(timestamp);
    const now = moment();
    
    if (date.isSame(now, 'day')) {
      return 'Today';
    } else if (date.isSame(now.clone().add(1, 'days'), 'day')) {
      return 'Tomorrow';
    } else {
      return date.format('dddd D MMMM');
    }
  }

  // Add days to a date
  filters.addDays = function(timestamp, days) {
    // If days is not provided or not a number, default to 0
    const daysToAdd = (!days || isNaN(parseInt(days))) ? 0 : parseInt(days);
    
    // Get a moment object from the timestamp
    const date = getMomentObject(timestamp);
    
    // Add the specified number of days and return the moment object
    return date.add(daysToAdd, 'days');
  }
//
// Add this filter to your app/filters.js file

// Combine date parts into a single date and format
filters.formatDateInput = function(data, fieldName) {
  // Check if we have the necessary data
  if (!data || !fieldName) return '';
  
  // Get the day, month, and year values
  const day = data[fieldName + '-day'];
  const month = data[fieldName + '-month'];
  const year = data[fieldName + '-year'];
  
  // Check if all values are present
  if (!day || !month || !year) return '';
  
  // Create a date string in ISO format (YYYY-MM-DD)
  const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  // Use moment to create and format the date
  const date = moment(dateString, 'YYYY-MM-DD');
  
  // Check if the date is valid
  if (!date.isValid()) return '';
  
  // Return formatted date with day and full month name
  return date.format('DD MMMM YYYY');
}


  /* ------------------------------------------------------------------
    Register filters with nunjucks environment
  ------------------------------------------------------------------ */
  Object.keys(filters).forEach(function(filterName) {
    env.addFilter(filterName, filters[filterName]);
  });

  return filters;
}