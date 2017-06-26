'use strict';

let config = require('config-lite'), db;
if (config.type === 'mongodb') {
	db = require('./mongodb/mongodbHelper');
} else {
	throw Error('not recognise database type');
}
module.exports = db;