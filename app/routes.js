// External dependencies
const express = require('express');

const router = express.Router();

// Add your routes here - above the module.exports line

// v1 create availability routes //

router.get(/addSessionType/, function (req, res) {
    if (req.query.radioGroup === "Repeat" ) {
        res.redirect('select-days');
    }
    else {
        res.redirect('session-date');
    }
});

module.exports = router;

