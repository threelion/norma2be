var express = require('express');
var router = express.Router();

// var respondMaker = require('../respondTemplates/transformer');
// var Unit = require('../../models/unit');
var File = require('../../models/file');
var changeRecord = require('../../models/common').changeRecord;

var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');

var curFolder = __dirname;
var docsFolder = curFolder.substr(0, curFolder.length-6) + "docs/";

router.get('/:id/download', function(req, res) {
	console.log('request for specified file');

	return File.findOne({_id: req.params.id }, function(err, file) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! file)
			return res.status(404).send({ error: 'Requested file not found'});

      // res.writeHead(200, {'content-type': file.content});
      // res.end();
      return res.sendFile(path.join(docsFolder, file._id + path.extname(file.initialFilename)));
	//		res.send(file);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for upload file');

  var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }

    if (files.file){

    	var file = files.file[0];

			var uploadingFile = new File({
				initialFilename: file.originalFilename,
				size: file.size,
				content: file.headers['content-type'],
				uploadedAt: new Date()
			})

			return uploadingFile.save( function(err, savedFile){
				if (err) {
					console.log(err);
					return res.status(500).send({ error: 'Error during request file saving'});
				}

		    fs.createReadStream(file.path).pipe(fs.createWriteStream(docsFolder + savedFile._id + path.extname(file.originalFilename)));
		    fs.unlinkSync(file.path);

				return res.send(savedFile);
			})
		}
	})
});

router.delete('/:id', function(req, res) {
	console.log('request for deleting file');
});

module.exports = router;