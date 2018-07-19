const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require('passport-local')

passport.use(User.createStrategy());

// passport.use(new LocalStrategy((email, password, next) => {

//    console.log(email, password)

//     User.findOne({ email }, (err, user) => {
//       if (err) {
//           console.log('err',err)
//         return next(err);
//       }
//       if (!user) {
//           console.log('u',user)

//           User.find()
//           .then(users=>{
//               console.log('users', users)
//           })

//         return next(null, false, { message: "Incorrect username" });
//       }
//     //   if (!bcrypt.compareSync(password, user.password)) {
//     //     return next(null, false, { message: "Incorrect password" });
//     //   }

//     console.log(user)
  
//       return next(null, user);
//     });
//   }));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;