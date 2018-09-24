var express = require('express');
var router = express.Router();

var TaskType = require('../../models/taskType');
var User = require('../../models/user');

var _ = require('lodash');

var Proposal = require('../../models/proposal');
var Product = require('../../models/product');
var PotentialPosition = require('../../models/potentialPosition');
var Country = require('../../models/country');
var Supplier = require('../../models/supplier');

router.get('/taskcard', function(req, res) {
	console.log('request for countrys list');

	var dataset = {};

	return User.find({isLocked: {$ne: true }}, {_id: 1, username: 1} ,function(err, executors) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		dataset.executors = executors;

		return User.find({ isLocked: {$ne: true }, role: 'Director'}, {_id: 1, username: 1}, function(err, controllers) {
			if (err) 
				return res.status(500).send({ error: 'Error during request'});

			dataset.controllers = controllers;

			return TaskType.find({}, function(err, tasktypes) {
				if (err) 
					return res.status(500).send({ error: 'Error during request'});

				dataset.taskTypes = tasktypes;

				return res.send(dataset);
			})

		})

	}) 
});

var getProposalsByPosition = function(position){
	return new Promise( function(resolve, reject) {
		return Proposal.find({position: position._id}, function(err, proposals){
			if (err) return reject(err);

			var newPosition = _.assign({}, position._doc, {proposals: proposals})

			return resolve(newPosition);
		})
	})
}

var getAllCountries = function(){
	return new Promise( function(resolve, reject) {
		return Country.find({}, function(err, countries){
			if (err) return reject(err);

			return resolve({ countries: countries});
		})
	})
}

var getAllSuppliers = function(){
	return new Promise( function(resolve, reject) {
		return Supplier.find({}, function(err, suppliers){
			if (err) return reject(err);

			return resolve({ suppliers: suppliers});
		})
	})
}

var getAllProducts = function(){
	return new Promise( function(resolve, reject) {
		return Product.find({}, function(err, products){
			if (err) return reject(err);

			return resolve({ products: products});
		})
	})
}

var getProposalVocabularies = function(){

	var promises2 = [];

	promises2.push(getAllCountries());
	promises2.push(getAllSuppliers());
	promises2.push(getAllProducts());

	return Promise.all( promises2 );
}

router.get('/proposalentering/deal/:dealId/executor/:executorId', function(req, res) {
	console.log('request for vocabularies and positions of the deal' + req.params.dealId + ' by executor' + req.params.executorId);

	var vocab = {};

	return PotentialPosition.find(
		{deal: req.params.dealId, executor: req.params.executorId}, 
		function(err, positions){
			if (err) 
				return res.status(500).send({ error: 'Error during request finding positions of the deal'});

			var promises = [];

			if (positions.length > 0){
				positions.forEach( function(o){
					promises.push(getProposalsByPosition(o))
				})

				return Promise.all( promises )
					.then( function(positionsWithProposals){

						return getProposalVocabularies().then( function(data){

							data.forEach( function(o){
								vocab = _.assign({}, vocab, o)
							})
							return res.send({ 
								positions: positionsWithProposals,
								vocabularies: vocab,
							})
						})
					})
			} else {
				return getProposalVocabularies().then( function(data){

					data.forEach( function(o){
						vocab = _.assign({}, vocab, o)
					})

					return res.send({ 
						positions: positions,
						vocabularies: vocab,
					})
				})
			}
	})
});

module.exports = router;