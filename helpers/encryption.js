/* Note: using staging server url, remove .testing() for production
Using .testing() will overwrite the debug flag with true */ 
var LEX = require('letsencrypt-express').testing();

var lex = LEX.create({
  configDir: __dirname + '/../le/etc',
  webrootPath: __dirname + '/../le/acme-challenge',
  approveRegistration: function (hostname, cb) { // leave `null` to disable automatic registration 
    // Note: this is the place to check your database to get the user associated with this domain 
    cb(null, {
      domains: [hostname]
    , email: 'test@arkservermanager.com' // user@example.com 
    , agreeTos: true
    });
  }
});

module.exports = lex;