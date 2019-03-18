var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

var autopopulate = require('mongoose-autopopulate');

var TaskGroup = require('./taskGroup');
// Schemas


var TaskType = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	name: {
		type: String,
		required: true
	},
	taskGroup: {
		type: String,
		ref: 'TaskGroup',
		autopopulate: {
			select: '_id name'
		}
	}
});

TaskType.path('name').validate( function (value) {
	return value.length < 50;
});

TaskType.plugin(autopopulate);

module.exports = mongoose.model('TaskType', TaskType);