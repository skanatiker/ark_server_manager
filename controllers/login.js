var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var users = require('../db/user');
var security = require('../models/security');

router.post('/', function (req, res) {
    var username = req.body.username;
    var password = crypto.createHash('sha256').update(req.body.password).digest('base64');
    users.findByUsername(username, function (err, user) {
      if (err) { 
        res.status(500).send({ message: err }); 
      }
      else if (!user) { 
        res.status(500).send({ message: 'Username or password invalid!' });
      }
      else if (user.password != password) { 
        res.status(500).send({ message: 'Username or password invalid!' }) 
      }
      else {
        var token = jwt.sign(user, security.secret, { expiresIn: 60*30 }); //expire is defined in seconds
        res.json({token: token});
      }
    });
});

module.exports = router;