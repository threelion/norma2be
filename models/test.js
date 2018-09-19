var mongoose = require('mongoose');
var path = require('path');
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;

var uuid = require('node-uuid');

var Schema = mongoose.Schema;

var Test = new Schema ({
	_id: {
		type: String,
		default: uuid.v1
	},
	name: {
		type: String,
		required: true
	}
})


var uploads_base = path.join(__dirname, "docs");
var uploads = path.join(uploads_base, "u");

Test.plugin(filePlugin, {
	name: "files",
	upload_to: make_upload_to_model(uploads, 'files'),
	relative_to: uploads_base
});

module.exports = mongoose.model('Test', Test);