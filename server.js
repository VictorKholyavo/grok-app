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

	app.get('/films', async function (req, res) {
		const films = await FilmsModel.find().exec();
		res.send(films.map(film => film.toClient()))
	})

	app.get('/films/:id', async function (req, res) {
		let film = await FilmsModel.findById( req.params.id , function (err, docs) {
			res.send(docs.toClient());
		})
	})

	app.post('/films', function (req, res) {
		let newFilm = new FilmsModel({
				rank: req.body.rank,
				title: req.body.title,
				year: req.body.year,
				votes: req.body.votes,
				rating: req.body.rating,
		});
		newFilm.save();
	})

	app.put('/films/:id', function (req, res) {
		FilmsModel.findOneAndUpdate(
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
		)
		.then(doc => {
			console.log(doc);
		})
	})

	app.delete('/films/:id', async function (req, res) {
		console.log(req.params);
		await FilmsModel.findOneAndRemove (
			{ _id: req.params.id }
		)
	})

	app.listen(3012, function () {
		console.log('API app started');
	})
})
