var express = require('express');
var bcrypt = require('bcrypt');
var jwt    = require('jsonwebtoken');
var config = require('../config');
const authJwt = require("../middlewares/authJwt");
var auth = express.Router();

auth.get('/', (req, res) => {
    res.send('ROOT')
})
  
auth.post('/login', function (req, res) {
      var db = require("../db");
      var User   = require('../models/user'); 
      var Role   = require('../models/role');
      User.findOne({
        email: req.body.email
      }).populate('role').then(function(user) {
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
                
                user.token = token;
        
                res.json(
                  {
                    email: user.email, 
                    token: token, 
                    id: user._id,
                    profilePhoto: user.profilePhoto,
                    userName: user.userName,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    city: user.city,
                    state: user.state,
                    zipCode: user.zipCode,
                    role: user.role
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
      }).finally(()=>{
        //db.disconect();
      })
});
  
auth.post('/register', function (req, res) {
  var db = require("../db");
  var User   = require('../models/user');
  var Role   = require('../models/role');
  var userEmail = req.body.email;
  var password = req.body.password;
  
  const role = Role.findById('64d452edd03216cf04107742').then((v) => {
    bcrypt.hash(password, 12).then(function(hashedPassword) {
      var user = new User({ 
        email: userEmail, 
        password: hashedPassword,
        role: v
      });
  
      user.save().then((u) => {
        res.json({ 
          message: 'User saved successfully' 
        });
      }).catch(function(err){
        res.status(500).send(err.message);
      }).finally(()=>{
        //db.disconect();
      })
    });
  });
});

auth.post('/uploadProfilePhoto', function (req, res) {
  var db = require("../db");
  var User   = require('../models/user'); 

  User.findById(req.body.userId)
    .exec((err, user) => {
    if (err) {
      res.status(500).send(err.message);
    }
    if (!user) {
      res.status(500).send('User invalid');
    }
    
    const query = { _id: req.body.userId };
    const update = { $set: { profilePhoto: req.body.base64image }};

    const options = {};
    User.updateOne(query, update, options, (err, xxx) => {
        res.json({ 
          message: 'Picture was Uploaded successfully' 
        });
    });
  });
});

auth.post("/updateProfileInfo", function (req, res) {
  var db = require("../db");
  var User = require('../models/user'); 
  User.findById(req.body.userId)
    .exec((err, user) => {
    if (err) {
      res.status(500).send(err.message);
    }
    if (!user) {
      res.status(500).send('User invalid');
    }
    
    const query = { _id: req.body.userId };
    const update = { $set: 
      { 
        userName: req.body.userName, 
        firstName: req.body.firstName, 
        lastName: req.body.lastName, 
        lastName: req.body.lastName,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zip
      } 
    };

    const options = {};
    User.findOneAndUpdate(query, update, options, (err, doc, result) => {
        res.json({ 
          message: 'Profile was updated successfully',
          user: doc
        });
    });
  });
});

auth.post('/requestPasswordReset', function(req, res) {
  var db = require("../db");
  var User   = require('../models/user'); 
  User.findOne({ email: req.body.email }).then(function(u) {

  });
});

auth.post("/testeToken", [ authJwt.verifyToken ], function (req, res) {
  res.json({ 
    message: 'Authenticated' 
  });
});

module.exports = auth;