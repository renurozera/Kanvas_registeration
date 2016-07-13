var express = require('express');
var router = express.Router();
var multer = require('multer');
var mkdirp = require('mkdirp');
var submissionSchema = require('../models/submissionSchema');
//note !!! note !!! note !!!
//so where this method came from
//well this method came bt the passport bidu!!!!
//it checks whether the session is created or not
//as evertime a request is made the deserializable is invoked and checked
function isAuthenticate(req,res,next){
  if(req.isAuthenticated()){
    next();
  }
  else{
    res.redirect('/');
  }
}

var storage = multer.diskStorage({
  destination: function(req,file,cb) {
    var path = createDir(req,file); //function call to create a dir in submissions folder
    console.log(path);
    cb(null,path)
  },
  filename:function(req,file,cb){
    cb(null,file.originalname)
  }
});

router.get('/',isAuthenticate,function(req,res){
  //console.log(req.user.fname);
  res.render('uploadFile');
});

//creating dir and saving the upload info in the table
function createDir(req,file){
  //console.log(req.user);
  console.log('CREATING THE DIRECTORY'+file.originalname);
  var username = req.user.username;
  //console.log(file.originalname);
  mkdirp('submissions/'+username,function(err){
    if(!err){
      console.log('dir created');
      //do the database stuff here
      //save the username and the filename in the submission schema once i have my file uploaded
      var newSubmission = new submissionSchema({
        username:req.user.username,
        filename:file.originalname
      });
      console.log('CREATING THE NEWSUBMISSION'+file.originalname);
      newSubmission.save(function(err,data){
        if(err){
          console.log('ERROR IN INSERTING THE FILE INTO THE SUBMISSION SCHEMA'+err);
          //res.send('file not saved');
        }
        else{
          console.log(data);
          console.log("FILE SAVED IN THE SUBMISSION TABLE");
          // res.redirect('/upload');
        }
      });
    }
    else{
      console.log(err);
    }
  });
  var path = 'submissions/'+username;
  return path;
}

var upload = multer({storage : storage}).single('filename');

router.post('/',isAuthenticate,function(req,res){
  upload(req,res,function(err){
    if(err){
      console.log(err);
      res.send('Error occured');
    }
    else{
      console.log('done uploading');
      res.send('File uploaded successfully');
    }
  });
});

module.exports = router;
