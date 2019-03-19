const UsersModel = require('../schemas/users');
const express = require('express');
let app = express();
const mongoose = require('mongoose');

app.get('/', async (req, res) => {
	try {
		let order = req.query.sort ? {name: req.query.sort.name } : {};
		let data = [];
		if (req.query.start && req.query.count) {
			data =  await UsersModel.find({}, null, {sort: order}).skip(+req.query.start).limit(+req.query.count).exec();
		}
		UsersModel.count().exec(function (err, total_count) {
			res.send({"pos": req.query.start, "data": data.map(doc => doc.toClient()), "total_count": total_count});
		})
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.put('/:id', async (req, res) => {
	try {
		await UsersModel.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$set: {
					name: req.body.name,
					age: req.body.age,
					gender: req.body.gender,
					company: req.body.company,
					favoriteFruit: req.body.favoriteFruit
				}
			},
			{
				new: true
			}
		)
		.then(doc => {
			console.log(doc);
		})
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

module.exports = app
