var express = require('express');
var router = express.Router();
var userSchema = require('../models/userSchema');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

router.get('/',function(req,res){
  res.render('register');
});

router.post('/',function(req,res){
  console.log('in the register');
  var user = req.body;
  var newUser = new userSchema({
    fname:user.fname,
    lname:user.lname,
    username:user.username,
    password:bcrypt.hashSync(user.password)
   });
  newUser.save(function(err,data){
    if(!err){
      console.log(data);
      res.send('you have been registered');
    }
    else{
      console.log(err.code+err);
      if(err.code === 11000){
      var error='the user with the username:'+user.username+' already exists';
      }
      else{
      var error='something bad happened';
      }
      res.send(error);
    }
  });
});

module.exports = router;
