var express = require('express')
var router = express.Router()

router.use('/login', require('./login'))
router.use('/config', require('./config'))
router.use('/user', require('./user'))

module.exports = router