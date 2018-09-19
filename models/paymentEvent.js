var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

// Schemas

var PaymentEvent = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	name: {
		type: String,
		required: true
	},
	name_ru: {
		type: String,
		required: true
	},
	// our: Boolean
});

PaymentEvent.path('name').validate( function (value) {
	return value.length < 30;
});

module.exports = mongoose.model('PaymentEvent', PaymentEvent);