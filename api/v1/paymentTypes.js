var express = require('express');
var router = express.Router();

// var respondMaker = require('../respondTemplates/transformer');
// var PaymentType = require('../../models/paymentType');
var PaymentType = require('../../models/paymentType');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for paymentTypes list');

	return PaymentType.find({}, function(err, paymentTypes) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(paymentTypes);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified paymentType info');

	return PaymentType.findOne({_id: req.params.id }, function(err, paymentType) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! paymentType)
			return res.status(404).send({ error: 'Requested paymentType not found'});

		res.send(paymentType);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new paymentType');

	var newPaymentType = new PaymentType({
		name: req.body.name,
		// signed_at: req.body.signed_at,
		// number: req.body.number
	});

	return newPaymentType.save( function(err, savedPaymentType) {
		if (err) {
			console.log(err)
			return res.status(500).send({ error: 'Error during request'});
		}

		return res.send(savedPaymentType);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying paymentType info');

	changeRecord(PaymentType, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a paymentType'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting paymentType');

	changeRecord(PaymentType, req.params.id, { is_old: true })
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a paymentType'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

module.exports = router;