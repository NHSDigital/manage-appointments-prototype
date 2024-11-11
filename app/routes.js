// External dependencies
const express = require('express');

const router = express.Router();

// Add your routes here - above the module.exports line

// v1 create availability routes //

// router.get(/addSessionType/, function (req, res) {
//     if (req.query.radioGroup === "Repeat" ) {
//         res.redirect('select-days');
//     }
//     else {
//         res.redirect('session-date');
//     }
// });


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
        res.redirect('bookings-scheduled-checkedin');
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
    else  if (req.query.radioGroup === "shorten" ) {
        res.redirect('edit-session-length');
    }
    else  if (req.query.radioGroup === "reduce" ) {
        res.redirect('edit-session-capacity');
    }    else {
        res.redirect('week-session-bookings-cancelled');
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


module.exports = router;

