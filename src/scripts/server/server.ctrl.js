angular.module('arkServerManagerApp.server').controller('ServerController', function ($scope, $rootScope, $location, $uibModal, Config) {

    if (!localStorage.token) {
      $location.path('/login');
      return;
    }

    $scope.log = "Log: \n";

    var host = location.origin.replace(/^http/, 'ws') + "?token=" + localStorage.token;
    var ws = new WebSocket(host);

    ws.onerror = function(error) {
        console.log("wserror:" + error);
    }

    ws.onclose = function(closeEvent) {
        console.log("disconnected");
        localStorage.removeItem("token");
        $location.path('/login');
        return;
    }

    ws.onopen = function() {
        Config.forKey('server').get({}, function(serverConfig){
          if (Object.keys(serverConfig).length <= 2) {
            $scope.openConfig()
          } else {
            $rootScope.memoryTarget = serverConfig.memoryTarget;
          }
        }); 
    }

    ws.onmessage = function(message){
        var messageObject = JSON.parse(message.data);
        if (messageObject.event == 'log'){
            $scope.log = $scope.log + messageObject.data.log + "\n";
            $scope.$apply();
            if ($('#log')[0]) {
              $('#log').scrollTop($('#log')[0].scrollHeight);
            }
        } else if (messageObject.event == 'serverStatus'){
            $scope.memory = messageObject.data.memory;
            $scope.$apply();
        }
    }

    $scope.startServer = function(){
        ws.send(JSON.stringify({event: "start"}));
    };

    $scope.updateServer = function(){
        ws.send(JSON.stringify({event: "update"}));
    };

    $scope.stopServer = function(){
        ws.send(JSON.stringify({event: "stop"}));
    };

    $scope.forceStopServer = function(){
        ws.send(JSON.stringify({event: "forceStop"}));
    };

    $scope.openConfig = function () {
      var modalInstance = $uibModal.open({
        templateUrl: '/partials/config.html',
        controller: 'ConfigController',
        backdrop: 'static',
        keyboard: false
      });
    }

});
