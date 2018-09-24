var express = require('express');
var router = express.Router();

var PotentialDeal = require('../../models/potentialDeal');
var PotentialPosition = require('../../models/potentialPosition');
var Proposal = require('../../models/proposal');
var changeRecord = require('../../models/common').changeRecord;

var _ = require('lodash');

router.get('/', function(req, res) {
	console.log('request for deals list');

	return PotentialDeal.find({}, function(err, deals) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(deals);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified deal info');

	return PotentialDeal.findOne({_id: req.params.id }, function(err, deal) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! deal)
			return res.status(404).send({ error: 'Requested deal not found'});

		res.send(deal);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new product');

	var newPotentialDeal = new PotentialDeal({
		name: req.body.name,
		issuedAt: new Date(),
		issuer: req.body.issuer._id,
	});

	return newPotentialDeal.save( function(err, savedDeal) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return PotentialDeal.findById( savedDeal._id, function(err, populatedDeal){
			if (err)
				return res.status(500).send({ error: 'Error during request'});
			
			return res.send(populatedDeal);
		})
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying product info');

	changeRecord(PotentialDeal, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a deal'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

router.delete('/:id', function(req, res) {
	console.log('request for deleting potential deal');
});

router.get('/:id/positions/', function(req, res) {
	console.log('request for positions of the deal');

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

router.get('/:dealId/positionsbyexecutor/:executorId', function(req, res) {
	console.log('request for positions of the deal' + req.params.dealId + ' by executor' + req.params.executorId);

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
						return res.send(positionsWithProposals)
					})
			} else {
				return res.send(positions);
			}
	})
});

module.exports = router;