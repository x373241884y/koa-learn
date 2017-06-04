const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-session');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/static'));

//session
app.use(session({
	key: 'koa-learn', /** (string) cookie key (default is koa:sess) */
	/** (number || 'session') maxAge in ms (default is 1 days) */
	/** 'session' will result in a cookie that expires when session/browser is closed */
	/** Warning: If a session cookie is stolen, this cookie will never expire */
	maxAge: 86400000,
	overwrite: false, /** (boolean) can overwrite or not (default true) */
	httpOnly: true, /** (boolean) httpOnly or not (default true) */
	signed: false, /** (boolean) signed or not (default true) */
}, app));

app.use(views(__dirname + '/server/views', {
	extension: 'ejs',
}));


let config = require('./config');

// logger
app.use(async(ctx, next) => {
	const start = new Date();
	let session=ctx.session;
	let request=ctx.request;
	let response=ctx.response;
	ctx.state = Object.assign({ //extend template context
		session: session,
		request: request,
		response: response
	}, config.templateOptions || {});
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});


config(app); //config

module.exports = app;
