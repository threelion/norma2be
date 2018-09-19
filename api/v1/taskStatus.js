var express = require('express');
var router = express.Router();

// var respondMaker = require('../respondTemplates/transformer');
// var TaskStatus = require('../../models/taskStatus');
var TaskStatus = require('../../models/taskStatus');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for taskStatus list');

	return TaskStatus.find({}, function(err, taskStatus) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(taskStatus);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified taskStatus info');

	return TaskStatus.findOne({_id: req.params.id }, function(err, taskStatus) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! taskStatus)
			return res.status(404).send({ error: 'Requested taskStatus not found'});

		res.send(taskStatus);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new taskStatus');

	var newTaskStatus = new TaskStatus({
		name: req.body.name,
		// signed_at: req.body.signed_at,
		// number: req.body.number
	});

	return newTaskStatus.save( function(err, savedTaskStatus) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return res.send(savedTaskStatus);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying taskStatus info');

	changeRecord(TaskStatus, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a taskStatus'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting taskStatus');

});

module.exports = router;