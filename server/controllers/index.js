let Job = require('../models/jobs');
exports.doGet = function () {
	return {
		"/": async function (ctx, next) {
			await ctx.render('index', {title: '拉钩找工作'});
		},
		"/salary": async function (ctx, next) {
			await ctx.render('salary', {title: '薪资统计Chart'});
		},
		"/workyear": async function (ctx, next) {
			await ctx.render('workyear', {title: '职位数'});
		},
		"/resume": async function (ctx, next) {
			await ctx.render('resume', {title: '如何写简历'});
		},
		"/mostsalary":async function (ctx, next) {
			try{
				let data =await Job.getMaxSalaryGroupByWorkYear();
				await ctx.render('mostsalary', {title: '土豪公司List', data: data});
			}catch (err){
				await ctx.render('error', {error: err});
			}
		},
	}
};