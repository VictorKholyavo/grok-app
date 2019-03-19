const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const FilmsController = require('./server/controllers/films');
const UsersController = require('./server/controllers/users');
const UsersModel = require('./server/schemas/users');

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

mongoose.connect(`mongodb://${process.env.DB_HOST || 'localhost'}:27017/myapir`, function (err) {
	if (err) throw err;
  console.log('Successfully connected');

	app.use('/films', FilmsController);

	app.use('/users', UsersController);

	app.listen(3012, function () {
		console.log('API app started');
	})
});
