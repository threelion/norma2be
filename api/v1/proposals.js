var express = require('express');
var router = express.Router();

var Proposal = require('../../models/proposal');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for proposals list');

	return Proposal.find({}, function(err, proposals) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(proposals);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new proposal');

	var newProposal = new Proposal({
		product: req.body.product,
		position: req.body.position,
		quantity: req.body.quantity,
		price: req.body.price,
		deliveryDays: req.body.deliveryDays,
		supplier: req.body.supplier,
		currencyRate: req.body.currencyRate,
		payOrder: req.body.payOrder,
		payMethod: req.body.payMethod,
		createdAt: req.body.createdAt,
		prepayPercent: req.body.prepayPercent,
	});

	return newProposal.save( function(err, savedProposal) {
		if (err) {
			console.log(err)
			return res.status(500).send({ error: 'Error during saving new proposal'});
		}

		return Proposal.findById( savedProposal._id, function(err, populatedProposal){
			if (err){
				console.log(err);
				return res.status(500).send({ error: 'Error during populating new Proposal'});
			}
			
			return res.send(populatedProposal);
		})
	})
});

module.exports = router;