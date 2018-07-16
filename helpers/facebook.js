const passport         = require('passport');
const FacebookStrategy = require('passport-facebook');
const User             = require('../models/User');

passport.use(new FacebookStrategy({
  clientID: "2175098822736334",
  clientSecret: "ee8fce0a2dd2d42b39903ed64036af0d",
  callbackURL: "http://localhost:3000/facebook/callback"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);
  User.create({ username: profile.displayName }, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
}
));

passport.serializeUser(function(user,cb){
  cb(null, user)
});

passport.deserializeUser(function(user,cb){
  cb(null, user)
})  

module.exports = passport;