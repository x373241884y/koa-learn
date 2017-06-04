var path = require('path');
var urls = require('./urls');
var settings = require('./settings');

configApp.templateOptions = settings.templateOptions;

function configApp(app) {
	//all controllers
	urls(app, settings);
}

module.exports = configApp;