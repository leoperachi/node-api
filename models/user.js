// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({ 
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    profilePhoto: {
      type: String,
      required:false
    },
    userName: {
      type: String,
      required:false
    },
    firstName: {
      type: String,
      required:false
    },
    lastName: {
      type: String,
      required:false
    },
    city: {
      type: String,
      required:false
    },
    state: {
      type: String,
      required:false
    },
    zipCode: {
      type: String,
      required:false
    }
}));