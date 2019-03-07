const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const FilmsModel = require('./server/schemes/films');

let cors = require('cors');
let path = require('path');

let app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '../')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function (req, res) {
	res.send('Hello API');
})

mongoose.connect(`mongodb://${process.env.DB_HOST || 'localhost'}:27017/myapir`, function (err) {
	if (err) throw err;
  console.log('Successfully connected');

	app.get('/films', async (req, res) => {
		try {
			const films = await FilmsModel.find().exec();
			res.send(films.map(film => film.toClient()));
		} catch (error) {
			res.status(500).send("Something broke");
		}
	})

	app.get('/films/:id', async (req, res) =>  {
		try {
			let film = await FilmsModel.findById(req.params.id , function (err, docs) {
				res.send(docs.toClient());
			})
		} catch(error) {
			res.status(500).send("Something broke");
		}
	})

	app.post('/films', async (req, res) => {
		try {
			let newFilm = await new FilmsModel({
				rank: req.body.rank,
				title: req.body.title,
				year: req.body.year,
				votes: req.body.votes,
				rating: req.body.rating,
			});
			newFilm.save(function(err, docs) {
				res.send(newFilm.toClient());
			});
		} catch (error) {
			res.status(500).send("Something broke");
		}
	})

	app.put('/films/:id', async (req, res) => {
		try {
			await FilmsModel.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						rank: req.body.rank,
						title: req.body.title,
						year: req.body.year,
						votes: req.body.votes,
						rating: req.body.rating
					}
				}
			);
		} catch (error) {
			res.status(500).send("Something broke");
		}
	})

	app.delete('/films/:id', async (req, res) => {
		try {
			await FilmsModel.findOneAndRemove(
				{ _id: req.params.id },
			);
			res.send({id: req.params.id})
		} catch (error) {
			res.status(500).send("Something broke");
		}
	})

	app.listen(3012, function () {
		console.log('API app started');
	})
})
