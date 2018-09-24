var express = require('express');
var router = express.Router();

var PotentialPosition = require('../../models/potentialPosition');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for deals list');

	return PotentialPosition.find({}, function(err, positions) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(positions);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified position info');

	return PotentialPosition.findOne({_id: req.params.id }, function(err, position) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! deal)
			return res.status(404).send({ error: 'Requested deal not found'});

		res.send(position);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new position');

	var newPotentialPosition = new PotentialPosition({
		product: req.body.product,
		unit: req.body.unit,
		deal: req.body.potentialDeal,
		quantity: req.body.quantity,
		initialPrice: req.body.initialPrice,
		executor: req.body.executor,
		deliveryDays: req.body.deliveryDays,
	});

	return newPotentialPosition.save( function(err, savedPosition) {
		if (err) {
			console.log(err);
			return res.status(500).send({ error: 'Error during request saving new Potential Position'});
		}

		return PotentialPosition.findById( savedPosition._id, function(err, populatedPosition){
			if (err)
				return res.status(500).send({ error: 'Error during request populating new potential position'});
			
			return res.send(populatedPosition);
		})
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying position info');

	changeRecord(PotentialPosition, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a position'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

router.delete('/:id', function(req, res) {
	console.log('request for deleting potential position');
});

module.exports = router;