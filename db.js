var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.db, { useNewUrlParser: true });

module.exports = 
{ 
    Mongoose: mongoose
}