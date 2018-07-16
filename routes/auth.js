const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const passportFacebook = require('../helpers/facebook');

//midelwers
function isAuth(req,res,next){
    if(req.isAuthenticated()) return res.redirect('/profile');
    return next();
}

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    return res.redirect('/login')
}

//rutas signup
router.get('/signup', (req,res)=>{
    console.log('entramos a singnup')
    res.render('auth/signup')
})

router.post('/signup',(req,res,next)=>{
    if(req.body.password !== req.body.password2){
        req.body.err = "Tu password no coincide"
        res.rendirect('auth/signup', req.body)
    }
    User.register(req.body, req.body.password)
    .then(user=>{
        res.rendirect('/login') 
    })
    .catch(e=>{
        req.body.err = errDict[e.name];
        res.render('auth/signup', req.body)
    })

})

//login faceboock
router.get('/facebook', passportFacebook.authenticate('facebook'));

router.get('/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/login');
});

//rutas login
router.get('/login', (req,res)=>{
    res.render('auth/login')
})

router.post('/login',(req,res,next)=>{
    res.redirect('/home')
})

//rutas perfil

router.get('/profile',isLoggedIn,(req,res,next)=>{
    res.render ('auth/profile')
})


//rutas home 

router.get('/home',isLoggedIn,(req,res,next)=>{
    res.render('auth/home')
})















module.exports = router;