angular.module('arkServerManagerApp').config(
  function($routeProvider, $httpProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: '/partials/login.html',
        controller: 'LoginController'
      }).
      when('/manager', {
        templateUrl: '/partials/manager.html',
        controller: 'ServerController'
      }).
      otherwise({
        redirectTo: '/manager'
      });
      $httpProvider.interceptors.push('myHttpInterceptor');
  }
);