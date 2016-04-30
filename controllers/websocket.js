var jwt = require('jsonwebtoken');
var url = require('url');
var WebSocketServer = require('ws').Server;

var command = require('../models/command');
var security = require('../models/security');

var wss;

exports.init = function(server){
  wss = new WebSocketServer({ server: server, perMessageDeflate: false });
  wss.on('connection', onConnection);

  wss.broadcast = function broadcast(event, data) {
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify({event: event, data: data}));
    });
  };

  var statusInterval = setInterval(function() {command.getServerStatus(wss)}, 2000);
}

function onConnection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  var token = location.query.token;

  try {
      if (!token){
        ws.close()
        return;
      }
      var user = jwt.verify( token, security.secret );
      console.log("token validated: " + user);
  }catch (err) {
      console.log("JWT could not be validated! " + err);
      ws.close()
      return;
  }

  console.log("client connected");
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function (message) {
    var messageObject = JSON.parse(message);
    if (messageObject.event == 'start'){
      command.updateServer(wss, command.startServer);
    } else if (messageObject.event == 'update'){
      command.updateServer(wss);
    } else if (messageObject.event == 'stop'){
      command.stopServer(wss);
    } else if (messageObject.event == 'forceStop'){
      command.stopServer(wss, true);
    }
  });

  ws.on('error', function (error) {
    console.log("error: " + error);
  });

  command.getServerStatus(wss);
}