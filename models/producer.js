var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

var autopopulate = require('mongoose-autopopulate');

var Country = require('./country');

// Schemas

var Producer = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	name: {
		type: String,
		required: true
	},
	country: {
		type: String,
		ref: 'Country',
		autopopulate: {
			select: '_id name brief'
		}		
	}
});

Producer.path('name').validate( function (value) {
	return value.length < 70;
});

Producer.plugin(autopopulate);

module.exports = mongoose.model('Producer', Producer);