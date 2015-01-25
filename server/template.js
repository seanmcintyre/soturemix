var mustache = require('mustache');
var fs = require('fs');
var config = require('../config');
var path = require('path');

var tplData = fs.readFileSync(path.join(config.templateFile)).toString();

module.exports = {
	render: function (data) {
		data = data || {};

		for (var key in config) {
			if (!data[key]) {
				data[key] = config[key];
			}
		}

		return mustache.render(tplData, data);
	}
}