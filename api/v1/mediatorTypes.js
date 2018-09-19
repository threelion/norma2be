var express = require('express');
var router = express.Router();

// var respondMaker = require('../respondTemplates/transformer');
// var Payment = require('../../models/payment');
// var MediatorType = require('../../models/mediatorType');
var MediatorType = require('../../models/mediatorType');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for mediatorTypes list');

	return MediatorType.find({}, function(err, mediatorTypes) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(mediatorTypes);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified mediatorType info');

	return MediatorType.findOne({_id: req.params.id }, function(err, mediatorType) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! mediatorType)
			return res.status(404).send({ error: 'Requested mediatorType not found'});

		res.send(mediatorType);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new mediatorType');

	var newMediatorType = new MediatorType({
		name: req.body.name,
		// delivered_at: req.delivered_at,
		// quantity: req.body.quantity,
		// operation_type: req.body.operation_type
	});

	return newMediatorType.save( function(err, savedMediatorType) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return res.send(savedMediatorType);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying mediatorType info');

	changeRecord(MediatorType, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a mediatorType'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting mediatorType');

	changeRecord(MediatorType, req.params.id, { is_old: true })
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a mediatorType'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

module.exports = router;