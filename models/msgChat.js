// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('MsgChat', new Schema({ 
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true
    },
    dtSent: {
      type: Date,
      required:true
    },
    drRead: {
      type: Date,
      required:false
    },
    msg: {
      type: String,
      required:true
    }
}));