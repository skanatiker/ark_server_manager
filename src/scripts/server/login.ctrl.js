angular.module('arkServerManagerApp.server').controller('LoginController', function ($scope, $location, Server) {

    $scope.login = function () {
      Server.login().save({username: $scope.username, password: $scope.password}, 
        function(result){
          localStorage.setItem("token", result.token);
          $location.path('/manager');
        },
        function(error){
          $scope.error = error.data.message;
        }
      );
    };

    $scope.logout = function () {
      localStorage.removeItem("token");
      $location.path('/login');
    };

});
