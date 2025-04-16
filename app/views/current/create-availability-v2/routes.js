// File: app/views/current/create-availability-v2/routes.js

module.exports = function (router) {
    // POST route to handle the form submission from session-time-capacity.html
    router.post('/current/create-availability-v2/session-time-capacity', function (req, res) {
      // Get the selected option from the form
      const selectedOption = req.body.example;
      
      // Redirect based on the selected option
      if (selectedOption === 'yes') {
        res.redirect('/current/create-availability-v2/add-breaks');
      } else {
        res.redirect('/current/create-availability-v2/session-summary');
      }
    });
    
    // Your destination pages
    router.get('/current/create-availability-v2/add-breaks', function (req, res) {
      res.render('current/create-availability-v2/add-breaks');
    });
    
    router.get('/current/create-availability-v2/session-summary', function (req, res) {
      res.render('current/create-availability-v2/session-summary');
    });
  };