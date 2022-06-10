var jwt    = require('jsonwebtoken');
var db = require("../db");
var config = require('../config');
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
  
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    
    jwt.verify(token.split('Bearer ')[1], config.jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: err.message });
      }
      
      req.userId = decoded.id;
      next();
    });
};

const authJwt = {
  verifyToken
};

module.exports = authJwt;