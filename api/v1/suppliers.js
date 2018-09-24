var express = require('express');
var router = express.Router();

var Supplier = require('../../models/supplier');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for suppliers list');

	return Supplier.find({}, function(err, suppliers) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(suppliers);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified supplier info');

	return Supplier.findOne({_id: req.params.id }, function(err, supplier) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! supplier)
			return res.status(404).send({ error: 'Requested supplier not found'});

		res.send(supplier);
	}) 
});


router.post('/', function(req, res) {
	console.log('request for new supplier');

	var newSupplier = new Supplier({
		country: req.body.country,
		name: req.body.name,
		contacts: req.body.contacts,
	});

	return newSupplier.save( function(err, savedSupplier) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return res.send(savedSupplier);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying supplier info');

	changeRecord(Supplier, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a supplier'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting supplier');

});

module.exports = router;