var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

// Schemas

var TaskStatus = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	name: {
		type: String,
		required: true
	}
});

TaskStatus.path('name').validate( function (value) {
	return value.length < 20;
});

module.exports = mongoose.model('TaskStatus', TaskStatus);