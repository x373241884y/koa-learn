let path = require('path');
let serverPath = path.resolve(__dirname, '../server');
let controllerPath = path.resolve(serverPath, 'controllers');
let filterPath = path.resolve(serverPath, 'filters');

module.exports = {
	serverPath: serverPath,
	controllerPath: controllerPath,
	filterPath: filterPath,
	templateOptions:{
		marked:function () {
			console.log('marked...');
		}
	}
};