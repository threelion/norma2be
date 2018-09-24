var mongoose = require('mongoose');
var uuid = require('node-uuid');

var autopopulate = require('mongoose-autopopulate');

var Schema = mongoose.Schema;
var User = require('./user');

// Schemas

var PotentialDeal = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	name: {
		type: String,
		required: true
	},
	issuedAt: {
		type: Date,
	},
	issuer: {
		type: String,
		ref: 'User',
		autopopulate: {
			select: '_id name'
		}
	}
});

PotentialDeal.path('name').validate( function (value) {
	return value.length < 80;
});

PotentialDeal.plugin(autopopulate);

module.exports = mongoose.model('PotentialDeal', PotentialDeal);