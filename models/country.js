var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

// Schemas

var Country = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	name: {
		type: String,
		required: true
	},
	brief: {
		type: String,
		required: true
	}
});

Country.path('name').validate( function (value) {
	return value.length < 30;
});

Country.path('brief').validate( function (value) {
	return value.length < 4;
});

module.exports = mongoose.model('Country', Country);