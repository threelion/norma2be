var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

// Schemas

var Currency = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	name: {
		type: String,
		required: true
	}
});

Currency.path('name').validate( function (value) {
	return value.length < 4;
});

module.exports = mongoose.model('Currency', Currency);