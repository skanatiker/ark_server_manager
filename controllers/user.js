var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var security = require('../models/security');
var users = require('../db/user');

router.post('/', expressJwt({ secret: security.secret}), function (req, res) {
    var data = req.body
    users.updateAdminUser(data.username, data.oldPassword, data.newPassword, function (err, result) {
      if (err) { 
        res.status(500).send({ message: err }); 
      }
      res.status(201);
      res.send(result);
    });
});

module.exports = router;