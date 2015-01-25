
var config;

if (process.env.ENVIRONMENT == 'production') {
	console.log('Running in production!');
	config = require('./config.deploy.js');
} else {
	console.log('Running in not-production');
	config = require('./config.dev.js');
}

var globalConfig = require('./config.global.js');
for (var key in globalConfig) {
	if (!config[key]) {
		config[key] = globalConfig[key];
	}
}

module.exports = config;