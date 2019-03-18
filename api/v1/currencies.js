var express = require('express');
var router = express.Router();

// var respondMaker = require('../respondTemplates/transformer');
// var Currency = require('../../models/currency');
var Currency = require('../../models/currency');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for currencys list');

	return Currency.find({}, function(err, currencys) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(currencys);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified currency info');

	return Currency.findOne({_id: req.params.id }, function(err, currency) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! currency)
			return res.status(404).send({ error: 'Requested currency not found'});

		res.send(currency);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new currency');

	var newCurrency = new Currency({
		name: req.body.name,
		// signed_at: req.body.signed_at,
		// number: req.body.number
	});

	return newCurrency.save( function(err, savedCurrency) {
		if (err) {
			console.log(err)
			return res.status(500).send({ error: 'Error during request'});
		}

		return res.send(savedCurrency);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying currency info');

	changeRecord(Currency, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a currency'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting currency');

	changeRecord(Currency, req.params.id, { is_old: true })
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a currency'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

module.exports = router;