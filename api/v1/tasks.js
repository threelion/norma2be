var express = require('express');
var router = express.Router();

var _ = require('lodash');

var Task = require('../../models/task');
var File = require('../../models/file');
var PotentialDeal = require('../../models/potentialDeal');

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
	console.log('request for tasks list for ceo');

	return Task.find({$or:[{executor: req.params.ceoId}, {controller: req.params.ceoId}]}, function(err, tasks) {
		if (err) {
			console.log(err);
			return res.status(500).send({ error: 'Error during request'});
		}

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

router.put('/:id', function(req, res) {
	console.log('request for modifying task info');

	return changeRecord(Task, req.params.id, req.body)
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

router.post('/', function(req, res) {
	console.log('request for new task');

	// var newTask = new Task({
	// 	name: req.body.name,
	// 	issuer: req.body.issuer,
	// 	//executors: req.body.executors,
	// 	controller: req.body.controller,
	// 	description: req.body.description,
	// 	deadline: req.body.deadline,
	// 	status: "c8ebbe80-b279-11e8-9dbd-f7e01824872b", // Status "Current"
	// 	isInitialTask: true,
	// 	taskType: req.body.taskType,
	// 	issuedAt: new Date(),
	// 	attachments: req.body.attachments,
	// });

	var newTask = {
		name: req.body.name,
		issuer: req.body.issuer,
		//executors: req.body.executors,
		controller: req.body.controller,
		description: req.body.description,
		deadline: req.body.deadline,
		status: "c8ebbe80-b279-11e8-9dbd-f7e01824872b", // Status "Current"
		isInitialTask: true,
		taskType: req.body.taskType,
		issuedAt: new Date(),
		attachments: req.body.attachments,
	};

	return makeExtraFieldsToTask(req.body)
		.then( function(extraFields){

			newTask = _.assign({}, newTask, extraFields);

			var newTasks = [];

			req.body.executor.forEach( function(o){
				newTasks.push(_.assign({}, newTask, {executor: o}))
			})

			return Task.insertMany(newTasks, function(err, savedTasks) {
				if (err) {
					console.log(err);
					return res.status(500).send({ error: 'Error during request'});
				}

					return res.send(savedTasks);
				})
			})
});

function makeExtraFieldsToTask(task){
	console.log(task.taskType);

	switch (task.taskType) {
		case "5a5ef580-b284-11e8-8c8d-4f0ec6e9498f": // Find proposals
			var deal = new PotentialDeal({
				name: task.name,
				issuedAt: new Date(),
				issuer: task.issuer._id,
			})

			return new Promise( function(resolve, reject){
				return deal.save( function(err, newDeal){
					if (err) {
						console.err('Error during saving new potential deal with new task');
						reject(err);
					}

					return resolve({potentialDeal: newDeal._id});
				})
			}) 

			break;
		// case "5a5ef580-b284-11e8-8c8d-4f0ec6e9498f": // Find proposals

		// 	break;
		// case "5a5ef580-b284-11e8-8c8d-4f0ec6e9498f": // Find proposals

		// 	break;
		// case "5a5ef580-b284-11e8-8c8d-4f0ec6e9498f": // Find proposals

			// break;
		default: 
			return new Promise( function(resolve, reject){
				return  resolve({});
				})
	}
}


module.exports = router;