angular.module('arkServerManagerApp.config').factory('Config', function ($resource) {
	var host = location.origin;
	return {
		forKey: function(key){
			return $resource(host + "/config/:key", {key: key});
		},
		forUser: function(){
			return $resource(host + "/user");
		}
	}
});