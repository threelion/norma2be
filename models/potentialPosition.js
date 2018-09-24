var mongoose = require('mongoose');
var uuid = require('node-uuid');

var autopopulate = require('mongoose-autopopulate');

var Schema = mongoose.Schema;
var User = require('./user');
var Unit = require('./unit');
var Product = require('./product');

// Schemas

var PotentialPosition = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	product: {
		type: String,
		ref: 'Product',
		required: true,
		autopopulate: {
			select: '_id name producer'
		}
	},
	deal: {
		type: String,
		ref: 'PotentialDeal',
		autopopulate: {
			select: '_id name issuedAt'
		}
	},
	initialPrice: {
		type: Number
	},
	quantity: {
		type: Number,
		required: true,
	},
	unit: {
		type: String,
		ref: 'Unit'
	},
	executor: {
		type: String,
		ref: 'User',
		autopopulate: {
			select: '_id username'
		},
		required: true
	},
	deliveryDays: {
		type: Number,
		required: true
	}
});

PotentialPosition.path('initialPrice').validate( function (value) {
	return (! value || value > 0);
});

PotentialPosition.path('quantity').validate( function (value) {
	return value > 0;
});

PotentialPosition.plugin(autopopulate);

module.exports = mongoose.model('PotentialPosition', PotentialPosition);