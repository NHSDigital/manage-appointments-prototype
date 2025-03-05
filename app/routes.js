//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const { getPDUs } = require('./helpers')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

router.get('*', function (req, res, next) {
  // These functions are available on all pages in the prototype.
  // To use call the function inside curly brackets, for example {{ example_function() }}

  // Examples of date
  //
  // {{ date() }} shows todays date in the format 5 May 2022
  // {{ date({day: 'numeric', month: 'numeric', year: 'numeric'}) }} shows todays date in the format 05/05/2022
  // {{ date({day: 'numeric'}) }} shows the just the date of date, 5
  // {{ date({day: '2-digit'}) }} shows the date with a leading zero, 05
  // {{ date({day: 'numeric'}, {'day': -1}) }} shows just the date of yesterday
  // {{ date({weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}) }} shows todays date in the format Tuesday, 5 July 2022.
  // {{ date({day: 'numeric', month: 'numeric', year: 'numeric'}, {'day': +2}) }}
  res.locals.date = function (
    format = { day: 'numeric', month: 'long', year: 'numeric' },
    diff = { year: 0, month: 0, day: 0 },
  ) {
    var date = new Date()
    if ('day' in diff) {
      date.setDate(date.getDate() + diff.day)
    }
    if ('month' in diff) {
      date.setMonth(date.getMonth() + diff.month)
    }
    if ('year' in diff) {
      date.setYear(date.getFullYear() + diff.year)
    }
    const formattedDate = new Intl.DateTimeFormat('en-GB', format).format(date)
    return `${formattedDate}`
  }

  // Examples of today
  //
  // Useful for pre-populating date fields
  //
  // {{ today().day }} shows just todays day
  // {{ today().month }} shows just todays month as a number
  // {{ today().year }} shows just todays year as a number
  res.locals.today = () => ({
    day: res.locals.date({ day: 'numeric' }),
    month: res.locals.date({ month: 'numeric' }),
    year: res.locals.date({ year: 'numeric' }),
  })

  // Examples of yesterday
  //
  // Useful for pre-populating date fields
  //
  // {{ yesterday().day }} shows just todays day
  // {{ yesterday().month }} shows just todays month as a number
  // {{ yesterday().year }} shows just todays year as a number
  res.locals.yesterday = () => ({
    day: res.locals.date({ day: 'numeric' }, (diff = { day: -1 })),
    month: res.locals.date({ month: 'numeric' }, (diff = { day: -1 })),
    year: res.locals.date({ year: 'numeric' }, (diff = { day: -1 })),
  })

  next()
})

// const radioButtonRedirect = require('radio-button-redirect')
// router.use(radioButtonRedirect)

// Add your routes here
// Search routes

require('./views/current/cas-310-311-312/v1/_routes')
require('./views/current/cas-310-311-312/v2/_routes')




router.get('/current/cas-310-311-312/v1/search', function (req, res, next) {
  res.locals.pdus = getPDUs(req)

  next()
})

router.get('/current/cas-310-311-312/v1/search/clear', function (req, res, next) {
  const key = req.session.data.key

  if (key) {
    if (key === 'all') {
      req.session.data = {}
    } else if (key === 'bedspaceSearchDate') {
      delete req.session.data['bedspaceSearchDate-day']
      delete req.session.data['bedspaceSearchDate-month']
      delete req.session.data['bedspaceSearchDate-year']
    } else {
      delete req.session.data[key]
    }

    delete req.session.data.clear
  }

  return res.redirect('/current/cas-310-311-312/v1/search-results')
})

router.get('/current/cas-310-311-312/v1/search-results', function (req, res, next) {
  res.locals.pdus = getPDUs(req)

  let results = bedspaces

  console.log(req.session.data)

  const attributesFilters = [
    req.session.data.bedspaceSearchGender,
    req.session.data.bedspaceSearchOccupancy,
    ...req.session.data.bedspaceSearchNeeds,
  ].filter(Boolean)

  console.log(attributesFilters)

  results = results.filter(bedspace => attributesFilters.every(attribute => bedspace.attributes.includes(attribute)))

  res.locals.results = results

  next()
})



router.get('/current/cas-310-311-312/v2/search', function (req, res, next) {
  res.locals.pdus = getPDUs(req)

  next()
})

router.get('/current/cas-310-311-312/v2/search/clear', function (req, res, next) {
  const key = req.session.data.key

  if (key) {
    if (key === 'all') {
      req.session.data = {}
    } else if (key === 'bedspaceSearchDate') {
      delete req.session.data['bedspaceSearchDate-day']
      delete req.session.data['bedspaceSearchDate-month']
      delete req.session.data['bedspaceSearchDate-year']
    } else {
      delete req.session.data[key]
    }

    delete req.session.data.clear
  }

  return res.redirect('/current/cas-310-311-312/v2/search-results')
})

router.get('/current/cas-310-311-312/v2/search-results', function (req, res, next) {
  res.locals.pdus = getPDUs(req)

  let results = bedspaces

  console.log(req.session.data)

  const attributesFilters = [
    req.session.data.bedspaceSearchGender,
    req.session.data.bedspaceSearchOccupancy,
    ...req.session.data.bedspaceSearchNeeds,
  ].filter(Boolean)

  console.log(attributesFilters)

  results = results.filter(bedspace => attributesFilters.every(attribute => bedspace.attributes.includes(attribute)))

  res.locals.results = results

  next()
})


// STANDARD BRANCHING  
router.post('/country-answer', function(request, response) {

  var country = request.session.data['country']
  if (country == "England"){
      response.redirect("/age")
  } else {
      response.redirect("/ineligible-country")
  }
})


// MULTI QUESTION REDIRECT

router.post('/redirect-test', function(request, response) {

  var hso = request.session.data['hso'];//
  var hld = request.session.data['hld'];//
  var hwp = request.session.data['hwp'];//

  if (hso === "yes" && hld === "yes" && hwp === "yes"){
    response.redirect("current/all-yes") // Initial redirect

  }
  else if (hso === "no" && hld === "no" && hwp === "no"){
    response.redirect("current/all-no") // Initial redirect

  }

  else if (hso === "yes" && hld === "no" && hwp === "yes"){
    response.redirect("current/all-yes") // Initial redirect

  }
  
})
// END 


router.get(/addSessionType/, function (req, res) {
    if (req.query.radioGroup === "Repeat" ) {
        res.redirect('availability-date-range');
    }
    else {
        res.redirect('session-date');
    }
});

router.get(/siteOpen/, function (req, res) {
    if (req.query.radioGroup === "yes" ) {
        res.redirect('session-time-capacity2');
    }
    else {
        res.redirect('check-days4');
    }
});

// V3 routes //

router.get(/cancelBooking/, function (req, res) {
    if (req.query.radioGroup === "Yes" ) {
        res.redirect('bookings-scheduled-cancelled');
    }
    else {
        res.redirect('bookings-scheduled');
    }
});

router.get(/deleteSession/, function (req, res) {
    if (req.query.radioGroup === "Yes" ) {
        res.redirect('week-session-bookings-cancelled');
    }
    else {
        res.redirect('week-session-bookings-honoured');
    }
});

router.get(/deleteDay/, function (req, res) {
    if (req.query.radioGroup === "Yes" ) {
        res.redirect('week-day-bookings-cancelled');
    }
    else {
        res.redirect('week-day-bookings-honoured');
    }
});

// v4 routes //

router.get(/editSession/, function (req, res) {
    if (req.query.radioGroup === "stop" ) {
        res.redirect('week-session-bookings-honoured');
    }
    else  if (req.query.radioGroup === "remove" ) {
        res.redirect('edit-single-session');
    }
    else {
        res.redirect('cancel-sure');
    }
});

router.get(/removeAvailability/, function (req, res) {
    if (req.query.radioGroup === "shorten" ) {
        res.redirect('edit-session-length');
    }
    else {
        res.redirect('edit-session-capacity');
    }
});

router.get(/affectedBookings/, function (req, res) {
    if (req.query.radioGroup === "cancel" ) {
        res.redirect('remove-confirmation');
    }
    else {
        res.redirect('week');
    }
});

router.get(/cancelSure/, function (req, res) {
    if (req.query.radioGroup === "cancel" ) {
        res.redirect('cancel-confirmation');
    }
    else {
        res.redirect('edit-session');
    }
});

// v5 routes //

router.get(/cancelDaySure/, function (req, res) {
    if (req.query.radioGroup === "cancel" ) {
        res.redirect('cancel-day-confirmation');
    }
    else {
        res.redirect('week');
    }
});

router.get(/cancelAffectedBooking/, function (req, res) {
    if (req.query.radioGroup === "Yes" ) {
        res.redirect('bookings-cancelled3');
    }
    else {
        res.redirect('bookings-list-manual-cancellation');
    }
});


module.exports = router;

