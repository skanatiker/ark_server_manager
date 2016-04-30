var express = require('express');
var expressJwt = require('express-jwt');
var security = require('../models/security');

var router = express.Router();
var configs = require('../db/config');
var users = require('../db/user');

router.get('/:key', expressJwt({ secret: security.secret}), function (req, res) {
    var key = req.params.key;
    configs.findByKey(key, function (err, config) {
      if (err) { 
        res.status(500).send({ message: err }); 
      }
      if (config == null){
        config = {}
      }
      res.send(config.data);
    });
});

router.post('/:key', expressJwt({ secret: security.secret}), function (req, res) {
    var key = req.params.key;
    var data = req.body
    configs.save(key, data, function (err, result) {
      if (err) { 
        res.status(500).send({ message: err }); 
      }
      res.status(201);
      res.send(result);
    });
});

module.exports = router;