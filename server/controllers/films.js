const FilmsModel = require('../schemas/films');
const express = require('express');
let app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const grid = require('gridfs-stream');

app.get('/', async function (req, res) {
	const films = await FilmsModel.find().exec();
	res.send(films.map(film => film.toClient()))
})

app.get('/:id', async function (req, res) {
	let film = await FilmsModel.findById(req.params.id, function (err, docs) {
		res.send(docs.toClient());
	})
})

app.post('/', function (req, res) {
	let newFilm = new FilmsModel({
		rank: req.body.rank,
		title: req.body.title,
		year: req.body.year,
		votes: req.body.votes,
		rating: req.body.rating,
		category: req.body.category,
		photo: req.body.photo
	});
	newFilm.save();
})

app.put('/:id', function (req, res) {
	//console.log(req.body);
	//let image = fs.readFileSync(process.env.IMAGE);
	//console.log(image);
	FilmsModel.findOneAndUpdate(
		{ _id: req.params.id },
		{
			$set: {
				rank: req.body.rank,
				title: req.body.title,
				year: req.body.year,
				votes: req.body.votes,
				rating: req.body.rating,
				category: req.body.category,
				photo: req.body.photo
			}
		}
	)
	.then(doc => {
		console.log(doc);
	})
});

app.delete('/:id', async function (req, res) {
	await FilmsModel.findOneAndRemove (
		{ _id: req.params.id }
	)
});

module.exports = app;
