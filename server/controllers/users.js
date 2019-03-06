const UsersModel = require('../schemas/users');
const express = require('express');
let app = express();
const mongoose = require('mongoose');

app.get('/', async function (req, res) {
	let order = req.query.sort ? {name: req.query.sort.name } : {};
	const users = await UsersModel.find().exec();
	await UsersModel.find({}, null, {sort: order}, function (err, docs) {
		let start = req.query.start;
		let count = req.query.count;
		let arr = [];

		for (let i = start; i <= +start + +count; i++) {
			arr.push(docs[i]);
		}
		res.send({"pos": start, "data": arr.map(user => user.toClient()), "total_count": 700});
	})
	//res.send(users.map(user => user.toClient()))
})


module.exports = app
