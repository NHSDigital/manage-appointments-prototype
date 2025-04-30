/**
 * NHS Prototype Kit - Date and Time Filters
 * 
 * This file contains Nunjucks filters for formatting dates and times
 * in line with the NHS digital service standards.
 * Compatible with Node.js 16.x
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
  const getMomentObject = function(timestamp) {
    if (!timestamp) return moment(); // Default to now
    
    // Handle string date representations
    if (typeof timestamp === 'string') {
      // Handle special date terms
      var lowerTimestamp = timestamp.toLowerCase();
      if (lowerTimestamp === 'now') return moment();
      if (lowerTimestamp === 'today') return moment();
      if (lowerTimestamp === 'tomorrow') return moment().add(1, 'days');
      if (lowerTimestamp === 'yesterday') return moment().subtract(1, 'days');
      
      // Check if it's a valid ISO or RFC2822 format
      var date = moment(timestamp);
      if (date.isValid()) return date;
      
      // If we can't parse it, return current date
      return moment();
    }
    
    // Handle moment objects
    if (moment.isMoment(timestamp)) return timestamp;
    
    // Handle Date objects and other inputs
    var date = moment(timestamp);
    return date.isValid() ? date : moment(); // Return now if invalid
  }

  /* ------------------------------------------------------------------
    Date formatting filters
  ------------------------------------------------------------------ */

  // Format a date in the standard NHS date format (1 January 2023)
  filters.nhsDate = function(timestamp) {
    var date = getMomentObject(timestamp);
    return date.format('D MMMM YYYY');
  }

  // Format a date in a shorter format (1 Jan 2023)
  filters.nhsShortDate = function(timestamp) {
    var date = getMomentObject(timestamp);
    return date.format('D MMM YYYY');
  }

  // Format a date in numeric format (01/01/2023)
  filters.nhsNumericDate = function(timestamp) {
    var date = getMomentObject(timestamp);
    return date.format('DD/MM/YYYY');
  }

  // Format a date with day name (Monday 1 January 2023)
  filters.nhsDateWithDay = function(timestamp) {
    var date = getMomentObject(timestamp);
    return date.format('dddd D MMMM YYYY');
  }

  // Format a date with time (1 January 2023 at 14:30)
  filters.nhsDateTime = function(timestamp) {
    var date = getMomentObject(timestamp);
    return date.format('D MMMM YYYY [at] HH:mm');
  }

  // Format just the time (14:30)
  filters.nhsTime = function(timestamp) {
    var date = getMomentObject(timestamp);
    return date.format('HH:mm');
  }

  // Format time with am/pm (2:30pm)
  filters.nhsTime12Hour = function(timestamp) {
    var date = getMomentObject(timestamp);
    return date.format('h:mma').toLowerCase();
  }

  // Format a date as relative time (today, yesterday, 2 days ago)
  filters.nhsRelativeDate = function(timestamp) {
    var date = getMomentObject(timestamp);
    var now = moment();
    
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
    var mins = parseInt(minutes);
    
    var hours = Math.floor(mins / 60);
    var remainingMins = mins % 60;
    
    var result = '';
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
    var date = getMomentObject(timestamp);
    var now = moment();
    
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
    var daysToAdd = (!days || isNaN(parseInt(days))) ? 0 : parseInt(days);
    
    // Get a moment object from the timestamp
    var date = getMomentObject(timestamp);
    
    // Add the specified number of days and return the moment object
    return date.add(daysToAdd, 'days');
  }

  // Helper for padding strings (for date formatting)
  filters.padStart = function(value, length, char) {
    var val = String(value);
    var padChar = char || '0';
    var pad = '';
    
    // Create padding
    for (var i = 0; i < length - val.length; i++) {
      pad += padChar;
    }
    
    return pad + val;
  }

// 

/**
 * NHS Prototype Kit Custom Nunjucks Filters
 * 
 * This file provides custom Nunjucks filters for the NHS prototype kit to format
 * and display siteName, ODS code, ICB, and Region data consistently.
 *
 * Usage examples:
 * {{ "Royal London Hospital" | siteName }}
 * {{ "RQM" | odsCode }}
 * {{ "NHS North West London ICB" | icb }}
 * {{ "London" | region }}
 *
 * Installation:
 * 1. Save this file as /app/filters.js (or add to existing filters.js)
 * 2. The prototype kit will automatically load these filters
 */

/**
 * Site name filter
 * Formats site names consistently across the prototype
 * @param {String} input - The site name to format
 */
const siteName = (input) => {
  if (!input) return '';
  
  // Standardize formatting for site names
  // e.g., ensure proper capitalization, append "Hospital" if missing, etc.
  let formattedName = input.trim();
  
  // Convert to title case (first letter of each word capitalized)
  formattedName = formattedName.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  
  // Example conditional formatting
  if (formattedName.toLowerCase().includes('hospital') === false && 
      formattedName.toLowerCase().includes('centre') === false && 
      formattedName.toLowerCase().includes('center') === false) {
    // Only append if it doesn't already have a type designation
    if (formattedName.toLowerCase().includes('gp') || 
        formattedName.toLowerCase().includes('surgery') ||
        formattedName.toLowerCase().includes('clinic')) {
      // It's already a primary care setting
    } else {
      formattedName += ' Hospital';
    }
  }
  
  return formattedName;
};

/**
 * ODS code filter
 * Formats ODS codes consistently (typically uppercase)
 * @param {String} input - The ODS code to format
 */
const odsCode = (input) => {
  if (!input) return '';
  
  // ODS codes are typically uppercase alphanumeric codes
  let formattedCode = input.trim().toUpperCase();
  
  // Optional: Add validation or additional formatting
  // Typical ODS codes are 3-5 characters
  if (formattedCode.length < 3) {
    return 'Invalid ODS code';
  }
  
  return formattedCode;
};

/**
 * ICB (Integrated Care Board) filter
 * Formats ICB names consistently
 * @param {String} input - The ICB name to format
 */
const icb = (input) => {
  if (!input) return '';
  
  let formattedICB = input.trim();
  
  // Standardize ICB naming convention
  // e.g., ensure "NHS" prefix and "ICB" suffix if not present
  if (!formattedICB.toLowerCase().startsWith('nhs')) {
    formattedICB = 'NHS ' + formattedICB;
  }
  
  if (!formattedICB.toLowerCase().endsWith('icb')) {
    formattedICB += ' ICB';
  }
  
  // Capitalize properly
  formattedICB = formattedICB.replace(/\b\w/g, c => c.toUpperCase());
  
  return formattedICB;
};

/**
 * Region filter
 * Formats NHS region names consistently
 * @param {String} input - The region name to format
 */
const region = (input) => {
  if (!input) return '';
  
  let formattedRegion = input.trim();
  
  // Define standard NHS England regions
  const standardRegions = [
    'London',
    'South East',
    'South West',
    'East of England',
    'Midlands',
    'North East and Yorkshire',
    'North West'
  ];
  
  // Try to match input to standard region
  const matchedRegion = standardRegions.find(region => 
    formattedRegion.toLowerCase().includes(region.toLowerCase())
  );
  
  if (matchedRegion) {
    return matchedRegion;
  }
  
  // If no match, just capitalize properly
  formattedRegion = formattedRegion.replace(/\b\w/g, c => c.toUpperCase());
  
  return formattedRegion;
};

/**
 * Trust name filter
 * Formats NHS Trust names consistently
 * @param {String} input - The trust name to format
 */
const trustName = (input) => {
  if (!input) return '';
  
  let formattedTrust = input.trim();
  
  // Standardize Trust naming convention
  if (!formattedTrust.toLowerCase().includes('nhs') && 
      !formattedTrust.toLowerCase().includes('foundation trust')) {
    formattedTrust += ' NHS Foundation Trust';
  }
  
  // Capitalize properly
  formattedTrust = formattedTrust.replace(/\b\w/g, c => c.toUpperCase());
  
  return formattedTrust;
};

// Export the filters for use in the prototype kit
module.exports = {
  siteName,
  odsCode,
  icb,
  region,
  trustName
};

  /* ------------------------------------------------------------------
    Register filters with nunjucks environment
  ------------------------------------------------------------------ */
  Object.keys(filters).forEach(function(filterName) {
    env.addFilter(filterName, filters[filterName]);
  });

  return filters;
}