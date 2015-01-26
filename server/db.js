var mongo = require('mongodb'),
	config = require('../config/credentials');

var db, callbacks = [];

function connectionString (config) {
	var str = 'mongodb://';
	if (config.user && config.pass) {
		str += config.user + ':' + config.pass;
	}
	str += '@' + config.host;
	str += ':' + config.port;
	str += '/' + config.name;
	return str;
}

function executeCallbacks () {
	for (var i = 0; i < callbacks.length; i++) {
		callbacks[i]();
	}
}

mongo.MongoClient.connect(connectionString(config.mongo), function (err, connection) {
	if (err) {
		throw err;
	}
	db = connection;
	executeCallbacks();
});

module.exports = {
	collection: function (name) {
		return db.collection(name);
	},
	open: function (fn) {
		callbacks.push(fn);
		if (db) {
			executeCallbacks();
		}
	},
	ObjectId: mongo.ObjectID
};
