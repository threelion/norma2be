var express = require('express');
var router = express.Router();

var Group = require('../../models/group');
var Consumer = require('../../models/consumer');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for groups list');

	return Group.find({}, function(err, groups) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(groups);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified group info');

	return Group.findOne({_id: req.params.id }, function(err, group) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! group)
			return res.status(404).send({ error: 'Requested group not found'});

		res.send(group);
	}) 
});

router.get('/:id/consumers', function(req, res) {
	console.log('request for specified group info');

	return Consumer.find({ group: req.params.id }, function(err, consumers) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! consumers)
			return res.status(404).send({ error: 'Requested group not found'});

		res.send(consumers);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new group');

	var newGroup = new Group({
		name: req.body.name,
		// country: req.body.country
	});

	return newGroup.save( function(err, savedGroup) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return res.send(savedGroup);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying group info');

	changeRecord(Group, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a group'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

router.delete('/:id', function(req, res) {
	console.log('request for deleting group');

	changeRecord(Group, req.params.id, { is_old: true })
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a group'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

module.exports = router;