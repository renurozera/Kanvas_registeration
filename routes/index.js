var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

router.get('/session',function(req,res){
  console.log(req.session.passport.user);
});
module.exports = router;
