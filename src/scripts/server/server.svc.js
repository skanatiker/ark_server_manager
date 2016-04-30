angular.module('arkServerManagerApp.server').factory('Server', function ($resource) {
	var host = location.origin;
	return {
		login: function(){
			return $resource(host + "/login");
		}
	}
});