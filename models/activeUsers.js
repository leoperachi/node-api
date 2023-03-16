// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('ActiveUser', new Schema({ 
    email: {
      type: String,
      required: true,
    },
    socketId: {
      type: String,
      required: true
    },
    dtActive:{
      type: Date,
      required: true
    },
    ipActive:{
      type: String,
      required: false
    }
}));