
if (process.env.ENVIRONMENT == 'production') {
	console.log('Running in production!');
	module.exports = require('./config.deploy.js');
} else {
	console.log('Running in not-production');
	module.exports = require('./config.dev.js');
}