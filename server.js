'use strict';
var express = require('express');
var helmet = require('helmet');
var http = require('http');
var https = require('spdy');
/* Note: using staging server url, remove .testing() for production
Using .testing() will overwrite the debug flag with true */ 
var LEX = require('letsencrypt-express').testing();
var websocket = require('./controllers/websocket');

var app = express();
var lex = require('./helpers/encryption')
lex.onRequest = app

app.use(express.static(__dirname + '/public'))
app.use(helmet());
app.use(require('morgan')('combined'));
app.use(require('body-parser').json());
app.use(require('./controllers'))

function redirectHttp() {
  http.createServer(LEX.createAcmeResponder(lex, function redirectHttps(req, res) {
    res.setHeader('Location', 'https://' + req.headers.host + req.url);
    res.statusCode = 302;
    res.end('<!-- Hello Developer Person! Please use HTTPS instead -->');
  })).listen(3000);
}

function serveHttps() {
  var server = https.createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, app));
  websocket.init(server);
  server.listen(3001);
}

redirectHttp();
serveHttps();
console.log("Server started");