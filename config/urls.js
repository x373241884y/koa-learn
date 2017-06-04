let fs = require("fs");
let path = require("path");
const router = require('koa-router')();

module.exports = function (app, settings) {

	let ctrls_path = settings.controllerPath, ctrl_path, controller;
	let files = fs.readdirSync(ctrls_path);
	for (let i = 0; i < files.length; i++) {
		ctrl_path = path.join(ctrls_path, files[i]);
		controller = require(ctrl_path);
		for (let key in controller) {
			if (key == "doGet") { //注册多个get
				let routes1 = controller[key]();
				for (let key1 in routes1) {
					if (routes1.hasOwnProperty(key1)) {
						configProxy(key1, routes1[key1]);
					}
				}
			} else if (key == "doPost") {//注册多个post
				let routes2 = controller[key]();
				for (let key2 in routes2) {
					if (routes2.hasOwnProperty(key2)) {
						configProxy(key2, routes2[key2], "post");
					}
				}
			} else {
				let small_router = controller[key]();
				let url;
				if (typeof small_router == "function") {
					url = "/" + key;
					configProxy(url, small_router);
				} else {
					url = small_router.url || key;
					if (typeof url == "string" && url.substr(0, 1) !== "/") {
						url = "/" + url;
					}
					configProxy(url, small_router.controller, small_router.method);
				}
			}
		}
	}

	app.use(router.routes());

	function configProxy(url, ctrl, method) {
		console.log('config---->url:' + url + ' with method:' + (method || 'get'));
		router[method || 'get'](url, ctrl);
	}

	//
	// //重写render方法，给所有的render view添加request,response,session
	// function rewriteRender() {
	// 	var render = app.response.render;
	// 	app.response.errorProxy = function (error) {
	// 		console.log(error);
	// 		errorProxy.apply(this, [error]);
	// 	};
	// 	app.response.render = function (view, options, callback) {
	// 		var res, req, session, done;
	// 		res = this;
	// 		req = res.req;
	// 		session = req.session;
	//
	// 		if (typeof options == "function") {
	// 			done = options;
	// 			options = {
	// 				request: req,
	// 				response: res,
	// 				session: session
	// 			};
	// 		} else {
	// 			options = options || {};
	// 			options.request = req;
	// 			options.response = res;
	// 			options.session = session;
	// 			done = callback;
	// 		}
	// 		options.utils = viewUtils;
	// 		options.doSEO = seoUtils;
	// 		render.apply(res, [view, options, done]);
	// 	};
	// }
};