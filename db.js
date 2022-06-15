var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.db, { useNewUrlParser: true }).then( x => 
    {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    }).catch(err => 
    {
        console.error("Error connecting to mongo", err);
    }
);

function disconect(){
    mongoose.disconnect();
}

module.exports = 
{ 
    Mongoose: mongoose,
    disconect: disconect
}