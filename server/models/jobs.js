var mongoose = require('mongoose'),
	config = require('./config'),
	common = require('../utils/common');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var uri = 'mongodb://' + config.host + ':' + config.port + '/' + config.db;
var db = mongoose.createConnection(uri);
db.on('error', console.error.bind(console, '连接错误:'));
var JobSchema = new mongoose.Schema({
	positionId: Number,
	positionName: String,
	positionAdvantage: String,
	salary: String,
	minsalary: Number,
	maxsalary: Number,
	companyName: String,
	companySize: String,
	companyLabelList: [String],
	industryField: String,
	education: String,
	workYear: String,
	createTime: Date
}, {collection: 'Jobs'});
var jobModel = db.model('Job', JobSchema);
function Job(job) {
	this.positionId = job.positionId,
		this.positionName = job.positionName,
		this.positionAdvantage = job.positionAdvantage,
		this.salary = job.salary,
		this.minsalary = common.getMinSalary(job.salary),
		this.maxsalary = common.getMaxSalary(job.salary),
		this.companyName = job.companyName,
		this.companySize = job.companySize,
		this.companyLabelList = job.companyLabelList,
		this.industryField = job.industryField,
		this.education = job.education,
		this.workYear = common.fromateWorkYear(job.workYear),
		this.createTime = new Date(job.createTime)
}
Job.prototype.save = function (callback) {
	var newjob = new jobModel(this);
	return newjob.save();
};
Job.removeAll = function (callback) {
	return jobModel.remove({});
};
Job.getTotalListGroupByWorkYear = function () {
	return jobModel.aggregate([{$group: {_id: "$workYear", total: {$sum: 1}}}, {$sort: {total: -1}}]).exec();
};
Job.getMinSalaryGroupByWorkYear = function () {
	return jobModel.aggregate([{
		$group: {
			_id: "$workYear",
			minValue: {$min: "$minsalary"}
		}
	}, {$sort: {_id: 1}}]).exec();
};
Job.getMaxSalaryGroupByWorkYear = function () {
	return jobModel.aggregate([{
		$group: {
			_id: "$workYear",
			maxValue: {$max: "$minsalary"}
		}
	}, {$sort: {_id: 1}}]).exec();
};
Job.getAvgSalaryGroupByWorkYear = function () {
	return jobModel.aggregate([{
		$group: {
			_id: "$workYear",
			avgValue: {$avg: "$minsalary"}
		}
	}, {$sort: {_id: 1}}]).exec();
};
Job.getCompanyListByWorkYear = function (workyear) {
	return jobModel.find()
		.where('workYear').equals(workyear)
		.limit(20)
		.sort('-minsalary')
		.exec();
};
module.exports = Job;