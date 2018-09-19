var express = require('express');
var router = express.Router();
var fs = require('fs');

var Test = require('../../models/test');

router.get('/:id', function(req, res) {
	console.log('request for specified task info');

	res.send({payload: "Get request"})

});

// router.post('/', function(req, res) {
// 	console.log('request for new task');

//   var form = new multiparty.Form();

//   form.parse(req, function(err, fields, files) {
//     if (err) {
//       res.writeHead(400, {'content-type': 'text/plain'});
//       res.end("invalid request: " + err.message);
//       return;
//     }



//     res.send('test passed');
//   });	

// });



var multiparty = require('multiparty');
var util = require('util');

var curFolder = __dirname;
var docsFolder = curFolder.substr(0, curFolder.length-6) + "docs/";

router.post('/', function(req, res) {
	console.log('request for new task');

  var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }
    console.log(docsFolder);

    var curFile = files.file[0];

    fs.createReadStream(curFile.path).pipe(fs.createWriteStream(docsFolder + curFile.originalFilename));
    fs.unlinkSync(curFile.path);

    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received fields:\n\n '+util.inspect(fields));
    res.write('\n\n');
    res.end('received files:\n\n '+util.inspect(files));
  });	

});

module.exports = router;