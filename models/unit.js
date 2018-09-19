var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

// Schemas

var Unit = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	name: {
		type: String,
		required: true
	}
});

Unit.path('name').validate( function (value) {
	return value.length < 15;
});

module.exports = mongoose.model('Unit', Unit);