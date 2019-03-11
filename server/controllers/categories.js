const CategoriesModel = require('../schemas/categories');
const express = require('express');
let app = express();
const mongoose = require('mongoose');

app.get('/', async function (req, res) {
	const categories = await CategoriesModel.find().exec();
	res.send(categories.map(category => category.toClient()));
})

app.get('/:id', async function (req, res) {
	let category = await CategoriesModel.findById(req.params.id, function (err, docs) {
		res.send(docs.toClient());
	})
})

app.put('/:id', async (req, res) => {
	try {
		await CategoriesModel.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$set: {
					value: req.body.value,
				}
			}
		);
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.post('/', function (req, res) {
	let newCategory = new CategoriesModel({
		value: req.body.value,
	});
	newCategory.save(function(err, docs) {
		res.send(newCategory.toClient());
	});
})

app.delete('/:id', async function (req, res) {
	await CategoriesModel.findOneAndRemove (
		{ _id: req.params.id }
	)
});

module.exports = app;
