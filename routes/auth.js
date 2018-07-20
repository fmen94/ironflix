const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Coment = require('../models/Comentos')
const passport = require('passport');
const fetch            = require('node-fetch');
const passportFacebook = require('../helpers/facebook');
const uploadCloud = require('../helpers/cloudinary');
const hbs          = require('hbs');
//helpers
hbs.registerHelper('titulos', function(id){
    fetch(`https://api.themoviedb.org/3/movie/351286?api_key=82b5663c68f2ad62437a48269129ca36`)
  .then(result => result.json())
  .then(movie => {
      console.log("esto es lo que lleva movie**************************************************************************************************",movie.title)
      return movie.title
  })
  });
  
  


//midelwers
function isAuth(req,res,next){
    if(req.isAuthenticated()) return res.redirect('/home');
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
        res.render('auth/signup', req.body)
    }
    User.register(req.body, req.body.password)
    //console.log("se agrego a la bd")
    .then(user=>{
        console.log('entraste')
        res.redirect('/login')
    })
    .catch(e=>{
        console.log("EEEEERRRROOORR")
        req.body.err = errDict[e.name];
        res.render('auth/signup', req.body)
    });
});

//login faceboock
router.get('/facebook', passportFacebook.authenticate('facebook'));

router.get('/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/login');
});

//rutas login
router.get('/login',isAuth, (req,res)=>{
    res.render('auth/login', {next:req.query.next})
})
router.post('/login', passport.authenticate('local'), (req,res,next)=>{
    if(req.body.next) res.redirect(req.body.next);
    req.app.locals.loggedUser = req.user;
    res.redirect('/home')
});


//logout
router.get('/logout', (req,res,next)=>{
    req.logout();
    res.redirect('/login')
});
    


//rutas perfil

router.get('/profile',isLoggedIn,(req,res,next)=>{
    User.findById(req.user._id)
    .then(us=>{
       // console.log(us)
        res.render ('auth/profile',us)
    })
    .catch(e =>{
        console.log(e)
    })
})
    

router.post('/profile', isLoggedIn, uploadCloud.single('foto'), (req, res, next)=>{
    if(!req.file) redirect('/profile');
    req.body.photoURL=req.file.url;
    console.log(req.user._id)
    User.findByIdAndUpdate(req.user._id, {photoURL: req.file.url}, {new:true})
    .then(user=>{
        console.log(user)
        res.redirect('/profile')

    })
    .catch(e=>next(e))
 });


//rutas home 

router.get('/home',isLoggedIn,(req,res,next)=>{
  
    fetch('https://api.themoviedb.org/3/genre/28/movies?api_key=82b5663c68f2ad62437a48269129ca36&language=es&include_adult=false&sort_by=created_at.asc')
  .then(results => results.json())
  .then(movies => {
    
    res.render('auth/home', movies); 
  });
});

router.post('/home',(req,res,next)=>{
    fetch("https://api.themoviedb.org/3/search/multi?api_key=064288a99145fce7b80f998a06a7f7d1&query="+req.body.buscado)
    .then(results => results.json())
   .then(movies => {
    res.render('auth/home', movies); 
});
})

//rutas details


    // router.get('/details/:id',isLoggedIn,(req,res)=>{

    //     const id =  req.params;
    //     fetch(`https://api.themoviedb.org/3/movie/${id.id}?api_key=82b5663c68f2ad62437a48269129ca36`)
    //     .then(result => result.json())
    //     .then(movie => {
    //       Coment.find({idpelicula:movie.id}).sort({updated_at:-1}).populate("user")
    //       .then(result=>{
    //         const mov={movie,result}
    //       console.log(mov)
    //       res.render('auth/detail', mov);
    //       })
    //        })
    //       });
    router.get('/details/:id',isLoggedIn,(req,res)=>{

        const id =  req.params;
        fetch(`https://api.themoviedb.org/3/movie/${id.id}?api_key=82b5663c68f2ad62437a48269129ca36`)
        .then(result => result.json())
        .then(movie => {
          Coment.find({idpelicula:movie.id}).sort({updated_at:-1})
          .then(result=>{
              const pic=[{}];
              result.forEach(e => {
                console.log("esto es e",e.user)
                User.find({_id:e.user})
                .then(r=>{
                    console.log("esto es r",r)
                    pic.push(r)
                })
              });
            const mov={movie,result,pic}
            console.log(mov)
            res.render('auth/detail', mov);
          })
           })
          });









//rutas about

router.get('/about',(req,res,next)=>{
    res.render('auth/about')
})

//rutas coments

router.post('/details/:id',(req,res)=>{
    const ids={
        title: req.body.title,
        text:req.body.text,
        idpelicula:req.params.id,
        user: req.user
    }
  //  Coment.register(req.body,ids)
  new Coment(ids)
  .save()
  .then(comment => {
    console.log("salvo el comentario")
    //req.flash('success_msg', 'Comment Added');
    res.redirect(`/details/${ids.idpelicula}`);
  })
    
})
//comentarios



router.get('/comments',isLoggedIn,(req,res)=>{
    Coment.find({user:req.user._id},(e,result)=>{
        const perfil= req.user
        const ob={result,perfil}
        console.log(ob)
        res.render('auth/comments',ob)
    })
})







module.exports = router;