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

// V2 routes //


module.exports = router;

