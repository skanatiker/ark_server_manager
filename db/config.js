var Datastore = require('nedb');

var configs = new Datastore({ filename: 'data/config.db', autoload: true });

exports.findByKey = function(key, callback){
	configs.findOne({configKey: key}, callback);
}

exports.save = function(key, data, callback){
	configs.update({configKey: key}, {configKey: key, data: data}, {upsert: true}, function(err, numUpdated){
		if (!err && numUpdated === 0){
			err = key + " could not be updated/inserted"
		}
		if (err){
			console.log(err)
			callback(err)
			return;
		}
		callback(null, key + " updated successfully")
	});
	
}