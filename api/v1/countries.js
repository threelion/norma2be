var express = require('express');
var router = express.Router();

// var respondMaker = require('../respondTemplates/transformer');
var Country = require('../../models/country');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for countrys list');

	return Country.find({}, function(err, countrys) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(countrys);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified country info');

	return Country.findOne({_id: req.params.id }, function(err, country) {
		if (err) {
			console.log(err);
			return res.status(500).send({ error: 'Error during request'});
		}

		if (! country)
			return res.status(404).send({ error: 'Requested country not found'});

		res.send(country);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new country');

	var newCountry = new Country({
		name: req.body.name,
		brief: req.body.brief
	});

	return newCountry.save( function(err, savedCountry) {
		if (err) {
			console.log(err);
			return res.status(500).send({ error: 'Error during request'});
		}

		return res.send(savedCountry);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying country info');

	changeRecord(Country, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a country'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

router.delete('/:id', function(req, res) {
	console.log('request for deleting country');

	changeRecord(Country, req.params.id, { is_old: true })
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a country'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

module.exports = router;