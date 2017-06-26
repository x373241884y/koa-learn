'use strict';

module.exports = {
	port: 3000,
	type: 'mongodb',
	url: 'mongodb://localhost:27017/Lagou',
	loggerLevel: 'info',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 30 * 24 * 60 * 60 * 1000,
		}
	},
	spider: {
		city:'北京',
		kd:'Node.js',
	}
};