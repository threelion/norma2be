var express = require('express');
var router = express.Router();

// var respondMaker = require('../respondTemplates/transformer');
// var TaskType = require('../../models/taskType');
var TaskType = require('../../models/taskType');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for taskTypes list');

	return TaskType.find({}, function(err, taskTypes) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(taskTypes);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified taskType info');

	return TaskType.findOne({_id: req.params.id }, function(err, taskType) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! taskType)
			return res.status(404).send({ error: 'Requested taskType not found'});

		res.send(taskType);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new taskType');

	var newTaskType = new TaskType({
		name: req.body.name,
		// signed_at: req.body.signed_at,
		// number: req.body.number
	});

	return newTaskType.save( function(err, savedTaskType) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return res.send(savedTaskType);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying taskType info');

	changeRecord(TaskType, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a taskType'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting taskType');

});

module.exports = router;