var express = require('express');
var router = express.Router();
var passport = require('passport');
var userSchema = require('../models/userSchema');
var LocalStrategy =require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var authFile = require('../auth.js');
var bcrypt = require('bcryptjs');

//local Strategy
passport.use(new LocalStrategy(function(username,password,done){
  console.log('IN THE LOCAL STRATEGY');
  userSchema.findOne({'username':username},function(err,user){
    console.log(user);
    if(err){
      console.log(err);
      return done(err);
    }
    if(!user){
      return done(null,false);
    }
    // if(user.password != password){
      if(bcrypt.compareSync(password,user.password) === false){
      return done(null,false);
    }
    return done(null,user);   //call the serialize method
  });
}
));

//facebook STRATEGY
passport.use(new FacebookStrategy({
  clientID:authFile.facebook.clientID,
  clientSecret:authFile.facebook.clientSecret,
  callbackURL:authFile.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done){
  console.log('IN THE FACEBOOK TOKEN');
  //now my work is :
  //to find whether user exits in db
  //otherwise extracts the info of the user and store them in the db
  userSchema.findOne({id:profile.id},function(err,user){
    if(err){
      console.log(err);
      return done(err);
    }
    if(user != ""){ //user Found
      return done(null,user);
    }
    else{
      var newuser = new userSchema({
        id:profile.id,
        fname:profile.name.givenName,
        lname:profile.name.familyName,
        username:profile.email
      });
      newuser.save(function(err){
        if(err){
          throw err;
        }
        else{
          return done(null,newuser);
        }
      });
    }
  });

}
));

//google Strategy
passport.use(new GoogleStrategy({
  clientID:authFile.google.clientID,
  clientSecret:authFile.google.clientSecret,
  callbackURL:authFile.google.callbackURL
},
function(accessToken, refreshToken, profile, done){
  console.log('IN THE GOOGLE TOKEN');
  userSchema.findOne({id:profile.id},function(err,user){
    console.log('USER FOUND'+user);
    if(err){
      console.log(err);
      return done(err);
    }
    if(user){
      return done(null,user);
    }
    else{
      console.log('in the gmail middleware');
      var newUser = new userSchema();
      newUser.id    = profile.id;
      newUser.fname  = profile.name.givenName;
      newUser.lname = profile.name.familyName;
      newUser.username = profile.email;
      newUser.save(function(err) {
      if (err)
      throw err;
      return done(null, newUser);
    });
    }
  })
}
)
);

router.get('/',function(req,res){
  res.render('login');
});

router.post('/',passport.authenticate('local'),function(req,res){
  res.redirect('upload');
});

router.get('/facebook',passport.authenticate('facebook'),function(req,res){
  res.send("hello fb");
});

router.get('/facebook/callback',
passport.authenticate('facebook',{
  successRedirect:'upload',
  failureRedirect:'/'
})
);

//routes for google authentication
router.get('/google',
    passport.authenticate('google', { scope: [
        'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'
    ] }
));

//route to handle google callback
router.get('/google/callback',passport.authenticate('google'),function(req,res){
  res.redirect('/upload');
});
module.exports = router;
