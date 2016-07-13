var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection( 'mongodb://localhost/kanvas16');
autoIncrement.initialize(connection,function(){
  console.log('autoIncrement added to register.js');
});

var userSchema = new mongoose.Schema({
  //firstname,lastname
  //username ,unique
  //password
  //oauthId (in case of social apps)
  id:String,
  fname:String,
  lname:String,
  username:{
    type:String,
    unique:true
  },
  password:String,
});

userSchema.plugin(autoIncrement.plugin,{model:'userSchema',field:'id'});//setting my id to autoincrement
var userSchema = mongoose.model('userSchema',userSchema);

module.exports = userSchema;
