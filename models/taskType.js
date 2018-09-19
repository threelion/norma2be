var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

// Schemas

var TaskType = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	name: {
		type: String,
		required: true
	}
});

TaskType.path('name').validate( function (value) {
	return value.length < 50;
});

module.exports = mongoose.model('TaskType', TaskType);