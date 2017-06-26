var superagent = require('superagent'),
	urlencode = require('urlencode'),
	logger = require('./server/utils/logger'),
	Job = require('./server/models/jobs');
var config = require('config-lite');
function InsertDB(Data) {
	for (var i = 0; i < Data.length; i++) {
		var job = Data[i];
		var newjob = new Job({
			positionId: job.positionId,
			positionName: job.positionName,
			positionAdvantage: job.positionAdvantage,
			salary: job.salary.toLowerCase(),
			companyName: job.companyFullName,
			companySize: job.companySize,
			companyLabelList: job.companyLabelList,
			industryField: job.industryField,
			education: job.education,
			workYear: job.workYear,
			createTime: job.createTime
		});
		newjob.save().then(function (data) {
			//
		});
	}
}
function getJobs(pageNo, city, kd) {
	var url = '';
	if (pageNo === 1) {
		url = 'http://www.lagou.com/jobs/positionAjax.json?city=' + urlencode(city) + '&first=true&kd=' + urlencode(kd) + '&pn=' + pageNo;
	} else {
		url = 'http://www.lagou.com/jobs/positionAjax.json?city=' + urlencode(city) + '&first=false&kd=' + urlencode(kd) + '&pn=' + pageNo;
	}
	logger.info('正在抓取' + pageNo + '页数据');
	superagent.get(url).end(function (err, sres) {
		if (err) {
			hasNextPage = false;
			console.log(err);
		}

		var jobjson = JSON.parse(sres.text);

		if (jobjson.success) {
			InsertDB(jobjson.content.positionResult.result);
			if (pageNo < jobjson.content.positionResult.totalCount) {
				getJobs(pageNo + 1, city, kd);
			} else {
				logger.info('抓取完毕，共抓取' + pageNo + '页数据');
				logger.info('结束时间:' + new Date().toLocaleTimeString());
			}
		} else {
			console.log(jobjson.msg);
			setTimeout(function () {
				getJobs(pageNo, city, kd);
			}, 300);
		}
	});
}
(function () {
	Job.removeAll().then(function (params) {
		logger.info("清空数据库...");
		logger.info(new Date().toLocaleTimeString() + '开始抓取' + config.spider.city + '的' + config.spider.kd + '职位');
		getJobs(1, config.spider.city, config.spider.kd);
	});
})();