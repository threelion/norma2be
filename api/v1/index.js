var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

	console.log(req.query.token);
	return res.send({payload: 'Welcome Page'});

})

module.exports = router;
