var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var configs = require('../db/config');

var serverPID;
var isStarting = false;
var isUpdating = false;

exports.startServer = function(wss) {
  if (!isStarting){
    isStarting = true;
    configs.findByKey('server', function(err, serverConfig) {
      var serverProcess = spawn(__dirname + '/../scripts/server_start.sh', [serverConfig.data.serverName, 
        serverConfig.data.serverPassword, serverConfig.data.serverAdminPassword, serverConfig.data.maxPlayers],
        {cwd: serverConfig.data.arkServerPath + '/ShooterGame/Binaries/Linux/'});
      wss.broadcast('log', {log: "" + "server start has been triggeed ..."});
      serverProcess.stdout.on('data', 
        function(data) {
          var log = '' + data;
          var index = log.indexOf('ServerPID:');
          if (index > -1){
            serverPID = log.substring(index + 10);
            console.log('Server PID received: ' + serverPID);
            wss.broadcast('log', {log: 'Server PID received: ' + serverPID});
          }
          console.log('stdout: ' + data);
          wss.broadcast('log', {log: "" + data});
        }
        );
      serverProcess.stderr.on('data', 
        function(data) {
          console.log('stderr: ' + data);
          wss.broadcast('log', {log: "" + data});
        }
        );
      serverProcess.on('error', function(err) {
        console.log("Error: " + err);
        wss.broadcast('log', {log: "Error starting or running the server: " + err});
      });
    });
  } else {
    wss.broadcast('log', {log: "server is already starting ..."});
  }
}

exports.stopServer = function(wss, force) {
  if (serverPID){
    var args = serverPID;
    if (force){
      args = '-9 ' + serverPID;
    }
    wss.broadcast('log', {log: "Stopping the server initiated: "});
    var serverProcess = exec('kill ' + args, function(error, stdout, stderr) {
      isStarting = false;
      if (stdout){
        wss.broadcast('log', {log: "Stopping Server: " + stdout});
      }
      if (error){
        wss.broadcast('log', {log: "Error stopping the server: " + error});
      }
    });
  } else {
    wss.broadcast('log', {log: "server cannot be stopped, because it is not running ..."});
  }
}

exports.updateServer = function(wss, followUpFunction) {
  if (!isUpdating && !isStarting){
    isUpdating = true;
    configs.findByKey('server', function(err, serverConfig) {
      var updateProcess = spawn(__dirname + '/../scripts/update_ark.sh', 
        [serverConfig.data.arkServerPath, serverConfig.data.backupPath], 
        {cwd: serverConfig.data.steamCmdPath});
      wss.broadcast('log', {log: "" + "server update has been triggered ..."});
      updateProcess.stdout.on('data', 
        function(data) {
          console.log('stdout: ' + data);
          wss.broadcast('log', {log: "" + data});
        }
        );
      updateProcess.stderr.on('data', 
        function(data) {
          console.log('stderr: ' + data);
          wss.broadcast('log', {log: "" + data});
        }
        );
      updateProcess.on('error', function(err) {
        console.log("Error: " + err);
        isUpdating = false;
        wss.broadcast('log', {log: "Error starting the update script: " + err});
      });
      updateProcess.on('close', function(code) {
        if (code === 0){
          wss.broadcast('log', {log: "update completed successfully"});
          if (followUpFunction){
            followUpFunction(wss);
          }
        }
        isUpdating = false;
      });
    })
  } else {
    wss.broadcast('log', {log: "update is already running or server is starting ..."});
  }
}

exports.getServerStatus = function(wss) {
  var cmd = __dirname + '/../scripts/get_server_status.sh';
  if (serverPID){
    cmd += ' ' + serverPID;
  }
  var serverProcess = exec(cmd, function(error, stdout, stderr) {
    if (stdout){
      var pidIndex = stdout.indexOf("PID: ");
      var memIndex = stdout.indexOf("MEM: ");
      if (pidIndex > -1 && memIndex > -1){
        serverPID = stdout.substring(pidIndex + 5, memIndex).trim();
        var mem = stdout.substring(memIndex + 5).trim();
        wss.broadcast('serverStatus', {memory: Math.round(parseInt(mem) / 1000)});
      } else {
        wss.broadcast('log', {log: "serverStatus script did not return a pid and mem value ..."});
      }
    }
    if (error) {
      wss.broadcast('log', {log: "Error getting server stats: " + error});
    }
  });
}