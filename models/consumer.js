var mongoose = require('mongoose');
var uuid = require('node-uuid');

var autopopulate = require('mongoose-autopopulate');

var Schema = mongoose.Schema;
var Country = require('./country');
var Group = require('./group');

// Schemas

var Consumer = new Schema({
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
			select: '_id name'
		}
	},
	is_old: {
		type: Boolean,
		default: false
	},
	group: {
		type: String,
		ref: 'Group',
		autopopulate: {
			select: '_id name'
		}
	}
});

Consumer.path('name').validate( function (value) {
	return value.length < 120;
});

Consumer.plugin(autopopulate);

// Consumer.pre('remove', function(next) {
// 	Contract.remove({ consumer: this.id }).exec();
// })

// Band.findOne({ name: "Guns N' Roses" }, function(error, doc) {
//       assert.ifError(error);
//       assert.equal('Axl Rose', doc.members[0].name);
//       assert.equal('William Bruce Rose, Jr.', doc.members[0].birthName);
//       done();
//     });

module.exports = mongoose.model('Consumer', Consumer);