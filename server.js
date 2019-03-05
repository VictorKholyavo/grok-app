const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const FilmsModel = require('./server/schemes/films');
const UsersModel = require('./server/schemes/users');
// let usersJSON = require('./generated.json');
// UsersModel.insertMany(usersJSON);

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

mongoose.connect('mongodb://localhost:27017/myapi', function (err) {
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
				id: new mongoose.Types.ObjectId(),
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
			},
			{
				new: true
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

//---------------------------------------------------------------------//

	app.get('/users', async function (req, res) {
		let order = req.query.sort ? {name: req.query.sort.name } : {};
		console.log(order);
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
	app.post('/users', function (req, res) {
		let newUser = new UsersModel({
				id: new mongoose.Types.ObjectId(),
				name: req.body.name,
				age: req.body.age,
				gender: req.body.gender,
				company: req.body.company,
				favoriteFruit: req.body.favoriteFruit,
		});
		newUser.save();
	})

	app.put('/users/:id', function (req, res) {
		UsersModel.findOneAndUpdate(
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
	})

	app.delete('/users/:id', async function (req, res) {
		await UsersModel.findOneAndRemove (
			{ _id: req.params.id }
		)
	})

	app.listen(3012, function () {
		console.log('API app started');
	})
})


//USERS for datasetB//


// app.get('/users/:id', function (req, res) {
// 	dbDynamic.collection('users').findOne(
// 		{ _id: req.params.id },
// 		function (err, docs) {
// 			docs.id = docs._id;
// 			delete docs._id
// 			res.send(docs)
// 		}
// 	)
// })
//
// app.put('/users/:id', function (req, res) {
// 	dbDynamic.collection('users').updateOne(
// 		{ _id: req.params.id},
// 		{$set: {name: req.body.name, age: req.body.age, gender: req.body.gender, company: req.body.company, favoriteFruit: req.body.favoriteFruit}},
// 		{
// 			upsert: false,
// 			multi: true
// 		},
// 		function (err, result) {
// 			if (err) return res.send({ status:"error" });
// 			res.send({});
// 		})
// })
//
