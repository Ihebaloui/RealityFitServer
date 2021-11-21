
const express = require('express')
const router = express.Router()
const passport = require('passport')
const session = require('express-session')



const facebookStrategy = require('passport-facebook').Strategy


//FACEBOOK LOGIN/////

router.use(passport.initialize)

router.use(passport.session)
router.use(session({secret:"thisissecretkey"}))

    //facebook strategy
    passport.use(new facebookStrategy({

      // pull in our app id and secret from our auth.js file
      clientID        : "945692233040516",
      clientSecret    : "febba9487b84b443e34ff93a417668e0",
      callbackURL     : "http://localhost:3000/facebook/callback"
  
  },// facebook will send back the token and profile
  function(token, refreshToken, profile, done) {
  
      console.log(profile)
      return done(null,profile)
  }));

  router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email,user_photos' }));


  router.get('/facebook/callback', passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
  }));

  router.get('/profile',(req,res) => {
    res.send("you are authenticated")
})

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  return done(null,user)
});




module.exports = router;