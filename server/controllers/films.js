const FilmsModel = require('../schemas/films');
const express = require('express');
let app = express();
const mongoose = require('mongoose');

app.get('/', async (req, res) => {
	try {
		const films = await FilmsModel.find().exec();
		res.send(films.map(film => film.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.get('/:id', async (req, res) =>  {
	try {
		let film = await FilmsModel.findById(req.params.id , function (err, docs) {
			res.send(docs.toClient());
		})
	} catch(error) {
		res.status(500).send("Something broke");
	}
})

app.post('/', async (req, res) => {
	try {
		let newFilm = await new FilmsModel({
			rank: req.body.rank,
			title: req.body.title,
			year: req.body.year,
			votes: req.body.votes,
			rating: req.body.rating,
			categoryID: req.body.categoryID
		});
		newFilm.save(function(err, docs) {
			res.send(newFilm.toClient());
		});
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.put('/:id', async (req, res) => {
	try {
		await FilmsModel.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$set: {
					rank: req.body.rank,
					title: req.body.title,
					year: req.body.year,
					votes: req.body.votes,
					rating: req.body.rating,
					categoryID: req.body.categoryID
				}
			}
		);
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.delete('/:id', async (req, res) => {
	try {
		await FilmsModel.findOneAndRemove(
			{ _id: req.params.id },
		);
		res.send({id: req.params.id})
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

module.exports = app;
