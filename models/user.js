var mongoose = require('mongoose');
var uuid = require('node-uuid');
var crypto = require('crypto');

var Schema = mongoose.Schema;

// Schemas

var User = new Schema({
	_id: { 
		type: String,
		default: uuid.v1
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	hashedPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	isLocked: Boolean,
	role: String,
});

// Validations

User.methods.encryptPassword = function(password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha1')
}

User.virtual('userId')
	.get( function() {
		return this._id
	})

User.virtual('password')
	.set( function(password) {
		this._plainPassword = password;
		this.salt = crypto.randomBytes(128).toString('base64');
		this.hashedPassword = this.encryptPassword(password);
	})
	.get( function() {
		return this._plainPassword;
	})

User.methods.checkPassword = function(password) {

	return this.encryptPassword(password) == this.hashedPassword;
}

// Conversations.path('name').validate( function (value) {
// 	return value.length > 2 && value.length < 50;
// });

module.exports = mongoose.model('User', User);