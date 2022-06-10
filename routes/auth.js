var express = require('express');
var bcrypt = require('bcrypt');
var jwt    = require('jsonwebtoken');
var config = require('../config');
var auth = express.Router();

auth.get('/', (req, res) => {
    res.send('ROOT')
})
  
auth.post('/login', function (req, res) {
      var db = require("../db");
      var User   = require('../models/user'); // get our mongoose model
      User.findOne({
        email: req.body.email
      }).then(function(user) {
        if (!user) { //nao achou
          res.status(401).send('Authentication failed. User not found.');
        }
        else{
            bcrypt.compare(req.body.password, user.password, function(err, matchPass) {
              if(matchPass){
                const payload = {
                  email: user.email,
                };
        
                token = jwt.sign(payload, config.jwtSecret, {
                    expiresIn: config.jwtDuration 
                });
        
                res.json(
                  {
                    email: user.email, 
                    token: token, 
                    id: user._id,
                    profilePhoto: user.profilePhoto,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    city: user.city,
                    state: user.state,
                    zipCode: user.zipCode
                  });
              }
              else{
                res.status(401).send('Authentication failed. Wrong password.');
              }
            });
        }
      }).catch(function(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
      })
});
  
auth.post('/register', function (req, res) {
      var db = require("../db");
      var User   = require('../models/user');
      var userEmail = req.body.email;
      var password = req.body.password;
      
      bcrypt.hash(password, 12).then(function(hashedPassword) {
        var user = new User({ 
          email: userEmail, 
          password: hashedPassword
        });
  
        user.save(function(err) {
          if (err) {
            res.status(500).send(err.message);
          }
          else{
            res.json({ 
              message: 'User saved successfully' });
          }
        });
      });
});

module.exports = auth;