var express = require('express');
var router = express.Router();

var DeliveryEvent = require('../../models/deliveryEvent');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for delivery event list');

	return DeliveryEvent.find({}, function(err, events) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(events);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified event');

	return DeliveryEvent.findOne({_id: req.params.id }, function(err, deliveryEvent) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! deliveryEvent)
			return res.status(404).send({ error: 'Requested deliveryEvent not found'});

		res.send(deliveryEvent);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new deliveryEvent');

	var newDeliveryEvent = new DeliveryEvent({
		name: req.body.name,
		// delivered_at: req.delivered_at,
		// quantity: req.body.quantity,
		// operation_type: req.body.operation_type
	});

	return newDeliveryEvent.save( function(err, savedDeliveryEvent) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return res.send(savedDeliveryEvent);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying deliveryEvent info');

	changeRecord(DeliveryEvent, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a deliveryEvent'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting deliveryEvent');

	changeRecord(DeliveryEvent, req.params.id, { is_old: true })
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a deliveryEvent'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

module.exports = router;