var express = require('express');
var router = express.Router();

// var respondMaker = require('../respondTemplates/transformer');
// var CurrencyRate = require('../../models/currencyRate');
var CurrencyRate = require('../../models/currencyRate');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for currencyRates list');

	return CurrencyRate.find({}, function(err, currencyRates) {
		if (err) {
			console.log(err)
			return res.status(500).send({ error: 'Error during request'});
		}

		res.send(currencyRates);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified currencyRate info');

	return CurrencyRate.findOne({_id: req.params.id }, function(err, currencyRate) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! currencyRate)
			return res.status(404).send({ error: 'Requested currencyRate not found'});

		res.send(currencyRate);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new currencyRate');

	var newCurrencyRate = new CurrencyRate({
		rate: req.body.rate,
		rateDate: req.body.rateDate,
		currency: req.body.currency,
		// number: req.body.number
	});

	return newCurrencyRate.save( function(err, savedCurrencyRate) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return res.send(savedCurrencyRate);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying currencyRate info');

	changeRecord(CurrencyRate, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a currencyRate'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting currencyRate');

	changeRecord(CurrencyRate, req.params.id, { is_old: true })
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a currencyRate'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

module.exports = router;