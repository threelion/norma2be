var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;
var Currency = require('./currency');

var autopopulate = require('mongoose-autopopulate');

// Schemas

var CurrencyRate = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	currency: {
		type: String,
		ref: 'Currency',
		autopopulate: {
			select: '_id name'
		}
	},
	rateDate: {
		type: Date,
		required: true
	},
	rate: {
		type: Number,
		required: true
	}
});

// Currency.path('name').validate( function (value) {
// 	return value.length < 3;
// });

CurrencyRate.plugin(autopopulate);

module.exports = mongoose.model('CurrencyRate', CurrencyRate);