var express = require('express');
var router = express.Router();

var TaskType = require('../../models/taskType');
var User = require('../../models/user');

router.get('/taskcard', function(req, res) {
	console.log('request for countrys list');

	var dataset = {};

	return User.find({isLocked: {$ne: true }}, {_id: 1, username: 1} ,function(err, executors) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		dataset.executors = executors;

		return User.find({ isLocked: {$ne: true }, role: 'Director'}, {_id: 1, username: 1}, function(err, controllers) {
			if (err) 
				return res.status(500).send({ error: 'Error during request'});

			dataset.controllers = controllers;

			return TaskType.find({}, function(err, tasktypes) {
				if (err) 
					return res.status(500).send({ error: 'Error during request'});

				dataset.taskTypes = tasktypes;

				return res.send(dataset);
			})

		})

	}) 
});


module.exports = router;