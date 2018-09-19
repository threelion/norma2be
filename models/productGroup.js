var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;
// Schemas

var ProductGroup = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	}
});


module.exports = mongoose.model('ProductGroup', ProductGroup);