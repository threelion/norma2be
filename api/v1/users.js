var express = require('express');
var router = express.Router();

//var expressJWT = require('express-jwt')
var jwt = require('jsonwebtoken')

var secret = { secret: 'my secret' };
//app.use(expressJWT(secret).unless({ path: [ '/', '/api/v1/session/create' ]}) )

var User = require('../../models/user')
//var respondMaker = require('../respondTemplates/transformer');


router.post('/login', function(req, res) {
	return User.findOne({ username: req.body.username}, function(err, foundUser) {
		if (err) console.log(err)

		if (! foundUser || foundUser.isLocked) {
			console.log('User not found');
			return res.status(401).send({
				user: {
					message: 'User with such name does not exist'
				}
			})
		}

		if (foundUser.checkPassword(req.body.password)) {

			console.log('User found and password match');

			var user = {
				name : req.body.username
			}
			
			var myToken = jwt.sign(user, secret.secret, { expiresIn: '4h'});
						
			user.id_token = myToken;
			user.role = foundUser.role;
			user._id = foundUser._id;

			return res.send( user )
			
		} else {
			console.log('User found but password is bad')

			return res.status(401).send({
				user: {
					message: 'Password does not match'
				}
			})
		}
	})

});

router.post('/create', function(req, res) {
	var user = new User({
			username: req.body.username,
			password: req.body.password,
		});

	return user.save( function(err, newUser){
		if (err) return res.status(500).send({ err: err })

		if (newUser){
			return res.send({user: newUser.username, status: 'Created'})
		}
	});

});

router.post('/lock/:userid', function(req, res) {

	return User.findOne({ _id: req.params.userid}, function(err, foundUser) {
		if (err) return res.status(500).send({ err: err });

		if (foundUser) return res.status(401).send({
					message: 'User with such name does not exist'
				})

		return User.findByIdAndUpdate( foundUser._id, {$set: {isLocked: true}}, function(err, lockedUser){
			if (lockedUser){
				return res.send({user: lockedUser.username, status: 'Locked'})
			}
		})
	})
});

router.post('/unlock/:userid', function(req, res) {

	return User.findOne({ _id: req.params.userid}, function(err, foundUser) {
		if (err) return res.status(500).send({ err: err });

		if (foundUser) return res.status(401).send({
					message: 'User with such name does not exist'
				})

		return User.findByIdAndUpdate( foundUser._id, {$set: {isLocked: false}}, function(err, unlockedUser){
			if (unlockedUser){
				return res.send({user: unlockedUser.username, status: 'Locked'})
			}
		})
	})
});

module.exports = router;