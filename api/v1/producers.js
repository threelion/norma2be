var express = require('express');
var router = express.Router();

var Producer = require('../../models/producer');
var changeRecord = require('../../models/common').changeRecord;

router.get('/', function(req, res) {
	console.log('request for producers list');

	return Producer.find({}, function(err, producers) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(producers);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified producer info');

	return Producer.findOne({_id: req.params.id }, function(err, producer) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! producer)
			return res.status(404).send({ error: 'Requested producer not found'});

		res.send(producer);
	}) 
});


router.post('/', function(req, res) {
	console.log('request for new producer');

	var newProducer = new Producer({
		country: req.body.country,
		name: req.body.name
	});

	return newProducer.save( function(err, savedProducer) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		return res.send(savedProducer);
	})
});

router.put('/:id', function(req, res) {
	console.log('request for modifying producer info');

	changeRecord(Producer, req.params.id, req.body)
		.then( function(data){

			if (! data) {
				return res.status(404).send({ error: 'There are no such a producer'});
			}
			res.send(data);
		})
		.catch( function(err){
			res.status(500).send({error: "Server Error"});
		})
});



router.delete('/:id', function(req, res) {
	console.log('request for deleting producer');

});

module.exports = router;