var mongoose = require('mongoose');

var submissionSchema = new mongoose.Schema({
  username:String,  //id of the user to find the userdetails
  filename:String, //name of the file
  date:{
    type:Date,
    default:Date.now  //set to the default value
  }
});

var submissionSchema = mongoose.model("submissionSchema",submissionSchema);
module.exports = submissionSchema;
//exports the model yo!!!
