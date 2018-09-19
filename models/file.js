var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

// Schemas

var File = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	initialFilename: {
		type: String,
		required: true
	},
	size: Number,
	content: String,
	uploadedAt: Date
});

File.upload = function(){


}

File.download = function(fileId){


}
module.exports = mongoose.model('File', File);