/**
 * add user
 * @returns {Function}
 */
//ajax接口
exports.doGet = function () {
	return {
		"/login.do": function (ctx, next) {
			let n = ctx.session.views || 0;
			ctx.session.views = ++n;
			console.log(ctx.cookies.get('koa-learn'));
			ctx.body = 'login-body....'+n + ' views';
		},
		"/register.do": function (ctx, next) {
			ctx.body = 'register-body....';
		}
	}
};

exports.doPost = function () {
	return {
		"/userinfo.do": function (ctx, next) {
			ctx.json = {
				username: "abc"
			};
		},
		"/userlist.do": function (ctx, next) {
			ctx.json = [{
				username: "abc1"
			}, {
				username: "abc2"
			}];
		}
	}
};