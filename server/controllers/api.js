let Job = require('../models/jobs');
exports.doGet = function () {
	return {
		"/api/getTotalListGroupByWorkYear": async function (ctx, next) {
			try {
				let data =await Job.getTotalListGroupByWorkYear();
				console.log(data);
				var result = [];
				data.forEach(function (element) {
					result.push({value: element.total, name: element._id});
				}, this);
				ctx.body = result;
			} catch (err) {
				await    ctx.render('error', {error: err});
			}

		}
	}
};

exports.doPost = function () {
	return {
		"/api/getSalary": async function (ctx, next) {
			try {
				var result = {};
				let data = await Job.getMinSalaryGroupByWorkYear();
				result.legend = [];
				result.min = [];
				result.max = [];
				result.avg = [];
				data.forEach(function (element) {
					result.legend.push(element._id);
					result.min.push(element.minValue);
				}, this);
				let data2 = await Job.getAvgSalaryGroupByWorkYear();
				data2.forEach(function (element) {
					result.avg.push(element.avgValue.toFixed(2));
				}, this);
				let data3 = await Job.getMaxSalaryGroupByWorkYear();
				data3.forEach(function (element) {
					result.max.push(element.maxValue);
				}, this);
				ctx.body = result;
				console.log(JSON.stringify(result, null, 4));
			} catch (err) {
				await ctx.render('error', {error: err});
			}
		},
		"/api/getCompanyListByMaxSalary": async function (ctx, next) {
			try{
				var workyear = ctx.request.body.workyear;
				console.log(workyear);
				let result = await Job.getCompanyListByWorkYear(workyear);
				ctx.body = result;
			}catch (err){
				await ctx.render('error', {error: err});
			}
		},
	}
};