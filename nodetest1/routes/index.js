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


// if the user is authenticated
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}



module.exports = function(passport){

//show index page on normal index page
  router.get('/', isAuthenticated, function(req, res) {
    res.render('index', { message: req.flash('message') });
  });

	router.get('/login', function(req, res) {
		//flash does not work with plain html
 		res.render('login', { message: req.flash('message') });
	});


	//send login data to the server
  router.post('/login', passport.authenticate('login', {
		successRedirect : '/index', // redirect to the index
		failureRedirect : '/login', // redirect back to the login
		failureFlash : true // allow flash messages (don't work)
  }));

	//show sign up page
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });


  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/index',
    failureRedirect: '/signup',
    failureFlash : true
  }));

	//logout
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
});

  return router;
}


router.get('/index', isAuthenticated, function(req, res){
	//flash does not work wiht plain html
  res.render('index', { message: req.flash('message') });
});

//get user data
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
