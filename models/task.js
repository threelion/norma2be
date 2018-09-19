var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

var TaskType = require('./taskType');
var TaskStatus = require('./taskStatus');
var User = require('./user');
var File = require('./file');

var autopopulate = require('mongoose-autopopulate');

var Task = new Schema ({
	_id: {
		type: String,
		default: uuid.v1
	},
	name: {
		type: String,
		required: true
	},
	executor: {
		type: String,
		ref: 'User',
		autopopulate:
		{
			select: '_id username'
		}
	},
	issuer: {
		type: String,
		ref: 'User',
		autopopulate:
		{
			select: '_id username'
		}
	},
	controller: {
		type: String,
		ref: 'User',
		autopopulate:
		{
			select: '_id username'
		}
	},
	description:{
		type: String
	},
	attachments: [{
		type: String,
		ref: 'File',
		autopopulate: {
			select: '_id initialFilename size content'
		}
	}],
	deadline: {
		type: Date,
		required: true
	},
	issuedAt: Date,
	executedAt: Date,
	status: {
		type: String,
		ref: 'TaskStatus',
		autopopulate: {
			select: '_id name'
		}
	},
	cancelationReason: String,
	isInitialTask: Boolean,
	nextTask: {
		type: String,
		ref: 'Task'
	},
	taskType: {
		type: String,
		ref: 'TaskType',
		autopopulate: {
			select: '_id name'
		}
	},
	// file: {
	// 	type: String,
	// 	ref: 'File',
	// 	autopopulate: {
	// 		select: '_id initialFilename size'
	// 	}

	// }
})

Task.plugin(autopopulate);

module.exports = mongoose.model('Task', Task);