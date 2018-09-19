var express = require('express');
var router = express.Router();

var Task = require('../../models/task');
var File = require('../../models/file');

var fs = require('fs');

var changeRecord = require('../../models/common').changeRecord;
var path = require('path');

var multiparty = require('multiparty');

var curFolder = __dirname;
var docsFolder = curFolder.substr(0, curFolder.length-6) + "docs/";

var email = require('emailjs');

var gmail = email.server.connect({
	user: "voljka13",
	password: "tRILLIOn1331",
	host: "smtp.gmail.com",
	ssl: true
})


router.get('/', function(req, res) {
	console.log('request for tasks list');

	return Task.find({}, function(err, tasks) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(tasks);
	}) 
});

router.get('/byexecutor/:executorId', function(req, res) {
	console.log('request for tasks list for executor');

	return Task.find({executor: req.params.executorId}, function(err, tasks) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		// var message = {
		// 	text: "Request for a executors # " + req.params.executorId + " tasks",
		// 	from: "voljka13 <voljka13@gmail.com>",
		// 	to: "voljka@inbox.ru",
		// 	subject: "Executor's tasks request commited"
		// };

		// gmail.send(message, function(err, message) { console.log( err || message )});

		res.send(tasks);
	}) 
});

router.get('/byceo/:ceoId', function(req, res) {
	console.log('request for tasks list for executor');

	return Task.find({$or:[{executor: req.params.ceoId}, {controller: req.params.ceoId}]}, function(err, tasks) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(tasks);
	}) 
});

router.get('/bycontroller/:controllerId', function(req, res) {
	console.log('request for tasks list for executor');

	return Task.find({controller: req.params.controllerId}, function(err, tasks) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		res.send(tasks);
	}) 
});

router.get('/:id', function(req, res) {
	console.log('request for specified task info');

	return Task.findOne({_id: req.params.id }, function(err, task) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! task)
			return res.status(404).send({ error: 'Requested task not found'});

		res.send(task);
	}) 
});

router.post('/', function(req, res) {
	console.log('request for new task');

  var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }

    var postedFields = fields;

    if (files.file){

    	var file = files.file[0];


			var newFile = new File({
				initialFilename: file.originalFilename,
				size: file.size,
				content: file.headers['content-type'],
				uploadedAt: new Date()
			})

			return newFile.save( function(err, savedFile){
				if (err) return res.status(500).send({ error: 'Error during request file saving'});

		    fs.createReadStream(file.path).pipe(fs.createWriteStream(docsFolder + savedFile._id + path.extname(file.originalFilename)));
		    fs.unlinkSync(file.path);

				var newTask = new Task({
					name: postedFields.name[0],
					issuer: postedFields.issuer[0],
					executor: postedFields.executor[0],
					controller: postedFields.controller[0],
					description: postedFields.description[0],
					deadline: postedFields.deadline[0],
					status: postedFields.status[0],
					isInitialTask: postedFields.isInitialTask[0],
					taskType: postedFields.taskType[0],
					issuedAt: new Date(),
					attachments: [savedFile._id],
				});

				return newTask.save( function(err, savedTask) {
					if (err) 
						return res.status(500).send({ error: 'Error during request'});

					return Task.findById( savedTask._id, function(err, populatedTask){
						if (err)
							return res.status(500).send({ error: 'Error during request'});
						
						return res.send(populatedTask);
					})
				})		    

			})

    } else {
				var newTask = new Task({
					name: postedFields.name[0],
					issuer: postedFields.issuer[0],
					executor: postedFields.executor[0],
					controller: postedFields.controller[0],
					description: postedFields.description[0],
					deadline: postedFields.deadline[0],
					status: postedFields.status[0],
					isInitialTask: postedFields.isInitialTask[0],
					taskType: postedFields.taskType[0],
					issuedAt: new Date(),
				});

				return newTask.save( function(err, savedTask) {
					if (err) 
						return res.status(500).send({ error: 'Error during request'});

					return Task.findById( savedTask._id, function(err, populatedTask){
						if (err)
							return res.status(500).send({ error: 'Error during request'});
						
						return res.send(populatedTask);
					})
				})
    }
  });	

});

router.put('/:id', function(req, res) {
	console.log('request for modifying task info');

  var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }

    var postedFields = fields;

		var newTask = {
			//issuedAt: new Date(),
		};
		if (postedFields.name) newTask.name = postedFields.name[0];
		if (postedFields.issuer)  newTask.issuer = postedFields.issuer[0];
		if (postedFields.executor) newTask.executor = postedFields.executor[0];
		if (postedFields.controller)  newTask.controller = postedFields.controller[0];
		if (postedFields.description)  newTask.description = postedFields.description[0];
		if (postedFields.deadline)  newTask.deadline = postedFields.deadline[0];
		if (postedFields.status)  newTask.status = postedFields.status[0];
		if (postedFields.taskType)  newTask.taskType = postedFields.taskType[0];
		if (postedFields.executedAt)  newTask.executedAt = postedFields.executedAt[0];
		if (postedFields.nextTask)  newTask.nextTask = postedFields.nextTask[0];
		if (postedFields.cancelationReason)  newTask.cancelationReason = postedFields.cancelationReason[0];
		if (postedFields.attachments)  newTask.attachments = postedFields.attachments[0];

		changeRecord(Task, req.params.id, newTask)
			.then( function(data){

				if (! data) {
					return res.status(404).send({ error: 'There are no such a task'});
				}

				return Task.findById( req.params.id, function(err, populatedTask){
					if (err)
						return res.status(500).send({ error: 'Error during request'});
					
					return res.send(populatedTask);
				})

				//res.send(data);
			})
			.catch( function(err){
				res.status(500).send({error: "Server Error"});
			})
  })
});

router.post('/:taskid/addfile/:fileid', function(req,res){
	return Task.findById(req.params.taskid, function(err, task) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! task){
			return res.status(400).send({ error: 'Task not exists'})
		}

		var alreadyExistedFile = false;

		if (task.attachments){
			task.attachments.forEach( function(file){
				if (file._id == req.params.fileid){
					alreadyExistedFile = true;
				}
			})
		}

		if (alreadyExistedFile){
			return res.status(304).send({error: 'File already exists at this task'});
		} else {
			if (! task.attachments) task.attachments = [];

			task.attachments.push(req.params.fileid);

			return Task.findByIdAndUpdate(
					{_id: req.params.taskid}, 
					{ $set: {attachments: task.attachments} },
					{ new: true }, function(err, newTask){
						return res.send(newTask)
					})
		}
	}) 
})

router.post('/:taskid/deletefile/:fileid', function(req,res){
	return Task.findById(req.params.taskid, function(err, task) {
		if (err) 
			return res.status(500).send({ error: 'Error during request'});

		if (! task){
			return res.status(400).send({ error: 'Task not exists'})
		}

		console.log(task.attachments);

		var newAttachments = [];

		if (task.attachments){
			task.attachments.forEach( function(file){
				if (file._id != req.params.fileid){
					newAttachments.push(file);
				}
			})
		}

		return Task.findByIdAndUpdate(
				{_id: req.params.taskid}, 
				{ $set: {attachments: newAttachments} },
				{ new: true }, function(err, newTask){
					return res.send(newTask)
				})
	}) 
})


router.delete('/:id', function(req, res) {
	console.log('request for deleting task');

});

module.exports = router;