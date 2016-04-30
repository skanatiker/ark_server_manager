var crypto = require('crypto');
var Datastore = require('nedb');

var users = new Datastore({ filename: 'data/users.db', autoload: true });

users.find({}, function(err, docs){
  if (docs.length == 0){
    var password = crypto.createHash('sha256').update('admin').digest('base64');
    users.insert({username: 'admin', password: password});
  }
});

exports.findByUsername = function(username, callback){
	users.findOne({ username: username }, callback);
}

exports.updateAdminUser = function(username, oldPassword, newPassword, callback){
	var updateObject = {};
	if (!oldPassword) {
		callback("Old password must be provided when updating admin user.");
		return;
	}
	if (username){
		updateObject.username = username;
	}
	if (newPassword){
		var newHashedPassword = crypto.createHash('sha256').update(newPassword).digest('base64');
		updateObject.password = newHashedPassword
	}
	var oldHashedPassword = crypto.createHash('sha256').update(oldPassword).digest('base64');
	users.update({password: oldHashedPassword}, {$set: updateObject}, function(err, updateCount){
		if (err) {
			callback(err)
			return
		}
		if (updateCount == 0){
			callback("Old password is invalid!")
			return
		}
		callback(null, "Admin User updated successfully");
	})
}