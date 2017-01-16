var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
// /* GET Hello World page. */
// router.get('/helloworld', function(req, res) {
//     res.render('helloworld', { title: 'Hello, World!' });
// });


// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}



module.exports = function(passport){

  /* GET login page. */
  router.get('/', isAuthenticated, function(req, res) {
    res.render('index', { message: req.flash('message') });
  });

	router.get('/login', function(req, res) {
		// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});


  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/index',
    failureRedirect: '/',
    failureFlash : true
  }));

  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });


  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/index',
    failureRedirect: '/signup',
    failureFlash : true
  }));

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
});

  return router;
}


router.get('/index', isAuthenticated, function(req, res){
  res.render('index', { message: req.flash('message') });
});


router.get('/api/user_data', function(req, res) {

            if (req.user === undefined) {
                // The user is not logged in
                res.json({});
            } else {
                res.json({
                    user: req.user
                });
            }
        });







/* GET Userlist page. */
// router.get('/userlist', function(req, res) {
//     var db = req.db;
//     var collection = db.get('userlist');
//     collection.find({},{},function(e,docs){
//         res.render('userlist', {
//             "userlist" : docs
//         });
//     });
// });

// module.exports = router;
