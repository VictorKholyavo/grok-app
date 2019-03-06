const CategoriesModel = require('../schemas/categories');
const express = require('express');
let app = express();
const mongoose = require('mongoose');

app.get('/', async function (req, res) {
	const categories = await CategoriesModel.find().exec();
	res.send(categories.map(category => category.toClient()));
})

app.post('/', function (req, res) {
	let newCategory = new CategoriesModel({
		category: req.body.category,
	});
	newCategory.save();
})

app.delete('/:id', async function (req, res) {
	await CategoriesModel.findOneAndRemove (
		{ _id: req.params.id }
	)
});

module.exports = app;
