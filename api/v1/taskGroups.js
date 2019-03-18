var express = require('express');
var router = express.Router();

// var respondMaker = require('../respondTemplates/transformer');
// var TaskGroup = require('../../models/taskGroup');
var TaskGroup = require('../../models/taskGroup');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for taskGroups list');

	return TaskGroup.find({}, function(err, taskGroups) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(taskGroups);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified taskGroup info');

	return TaskGroup.findOne({_id: req.params.id }, function(err, taskGroup) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! taskGroup)
			return res.status(404).send({ error: 'Requested taskGroup not found'});

		res.send(taskGroup);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new taskGroup');

	var newTaskGroup = new TaskGroup({
		name: req.body.name,
		// signed_at: req.body.signed_at,
		// number: req.body.number
	});

	return newTaskGroup.save( function(err, savedTaskGroup) {
		if (err) {
			console.log(err)
			return res.status(500).send({ error: 'Error during request'});
		}

		return res.send(savedTaskGroup);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying taskGroup info');

	changeRecord(TaskGroup, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a taskGroup'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting taskGroup');

	changeRecord(TaskGroup, req.params.id, { is_old: true })
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a taskGroup'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

module.exports = router;