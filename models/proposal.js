var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;
var Product = require('./product');
var Supplier = require('./supplier');
var PotentialPosition = require('./potentialPosition');

var autopopulate = require('mongoose-autopopulate');
// Schemas

var Proposal = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	product: {
		type: String,
		ref: 'Product',
		autopopulate: {
			select: '_id name producer'
		}
	},
	position: {
		type: String,
		ref: 'PotentialPosition',
		autopopulate: {
			select: '_id name producer'
		}
	},
	quantity:{
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	deliveryDays: {
		type: Number,
		required: true
	},
	supplier: {
		type: String,
		ref: 'Supplier',
		autopopulate: {
			select: '_id name contacts country'
		},
		required: true
	}
});

// Product.path('name').validate( function (value) {
// 	return value.length < 150;
// });

// Product.path('kved').validate( function (value) {
// 	return value.length < 20;
// });

Proposal.plugin(autopopulate);


module.exports = mongoose.model('Proposal', Proposal);