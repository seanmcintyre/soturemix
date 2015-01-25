var mongo = require('mongodb'),
	config = require('../config/credentials');

var db;
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

mongo.MongoClient.connect(connectionString(config.mongo), function (err, connection) {
	if (err) {
		throw err;
	}
	db = connection;
});

module.exports = {
	collection: function (name) {
		return db.collection(name);
	},
	ObjectId: mongo.ObjectID
};
