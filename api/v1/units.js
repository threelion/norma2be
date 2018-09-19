var express = require('express');
var router = express.Router();

// var respondMaker = require('../respondTemplates/transformer');
// var Unit = require('../../models/unit');
var Unit = require('../../models/unit');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for units list');

	return Unit.find({}, function(err, units) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(units);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified unit info');

	return Unit.findOne({_id: req.params.id }, function(err, unit) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! unit)
			return res.status(404).send({ error: 'Requested unit not found'});

		res.send(unit);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new unit');

	var newUnit = new Unit({
		name: req.body.name,
		// signed_at: req.body.signed_at,
		// number: req.body.number
	});

	return newUnit.save( function(err, savedUnit) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return res.send(savedUnit);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying unit info');

	changeRecord(Unit, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a unit'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting unit');

	changeRecord(Unit, req.params.id, { is_old: true })
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a unit'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

module.exports = router;