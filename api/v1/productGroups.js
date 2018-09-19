var express = require('express');
var router = express.Router();

var ProductGroup = require('../../models/productGroup');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for productGroups list');

	return ProductGroup.find({}, function(err, productGroups) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(productGroups);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified productGroup info');

	return ProductGroup.findOne({_id: req.params.id }, function(err, productGroup) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! productGroup)
			return res.status(404).send({ error: 'Requested productGroup not found'});

		res.send(productGroup);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new productGroup');

	var newProductGroup = new ProductGroup({
	});

	return newProductGroup.save( function(err, savedProductGroup) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return ProductGroup.findById( savedProductGroup._id, function(err, populatedProductGroup){
			if (err)
				return res.status(500).send({ error: 'Error during request'});
			
			return res.send(populatedProductGroup);
		})
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying productGroup info');

	changeRecord(ProductGroup, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a productGroup'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});

router.delete('/:id', function(req, res) {
	console.log('request for deleting productGroup');

});

module.exports = router;