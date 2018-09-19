var express = require('express');
var router = express.Router();

var PaymentEvent = require('../../models/paymentEvent');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for delivery event list');

	return PaymentEvent.find({}, function(err, events) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(events);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified event');

	return PaymentEvent.findOne({_id: req.params.id }, function(err, paymentEvent) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! paymentEvent)
			return res.status(404).send({ error: 'Requested paymentEvent not found'});

		res.send(paymentEvent);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new paymentEvent');

	var newPaymentEvent = new PaymentEvent({
		name: req.body.name,
		// delivered_at: req.delivered_at,
		// quantity: req.body.quantity,
		// operation_type: req.body.operation_type
	});

	return newPaymentEvent.save( function(err, savedPaymentEvent) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return res.send(savedPaymentEvent);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying paymentEvent info');

	changeRecord(PaymentEvent, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a paymentEvent'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting paymentEvent');

	changeRecord(PaymentEvent, req.params.id, { is_old: true })
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a paymentEvent'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

module.exports = router;