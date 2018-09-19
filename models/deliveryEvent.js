var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

// Schemas

var DeliveryEvent = new Schema({
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

DeliveryEvent.path('name').validate( function (value) {
	return value.length < 30;
});

module.exports = mongoose.model('DeliveryEvent', DeliveryEvent);