angular.module('arkServerManagerApp.config').controller('ConfigController', function ($scope, $rootScope, $uibModalInstance, Config) {

    $scope.server = {};
    $scope.user = {};

    Config.forKey('server').get({}, function(serverConfig){
      if (serverConfig) {
        $scope.server = serverConfig;
      }
    }); 

    var validate = function() {
      if (!$scope.server.memoryTarget || !$scope.server.arkServerPath || !$scope.server.steamCmdPath ||
        !$scope.server.serverName || !$scope.server.serverAdminPassword) {
        $scope.error = "Please set all required fields indicated with a *."
        return false;
      }
      else {
        return true;
      }
    }

    $scope.save = function () {
      if (!validate()){
        return
      }
      $scope.error = null;
      Config.forKey('server').save($scope.server, 
        function(result){
          if ($scope.user.username || $scope.user.newPassword){
            Config.forUser().save($scope.user, 
              function(result){
                $rootScope.memoryTarget = $scope.server.memoryTarget
                $uibModalInstance.dismiss('cancel');
              },
              function(err){
                $scope.error = err.data.message;
              }
            );    
          } else {
            $rootScope.memoryTarget = $scope.server.memoryTarget
            $uibModalInstance.dismiss('cancel');
          }   
        },
        function(err){
          $scope.error = err.data.message;
        }
      );
    };

    $scope.close = function () {
      if (!validate()){
        return
      }
      $uibModalInstance.dismiss('cancel');
    };

});
