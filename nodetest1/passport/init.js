var login = require('./login');
var signup = require('./signup');
var User = require('../models/user');

module.exports = function(passport){

	// serialize user
    passport.serializeUser(function(user, done) {
      //  console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });

    //deserialize user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          //  console.log('deserializing user:',user);
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}
