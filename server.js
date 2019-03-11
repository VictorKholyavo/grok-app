const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var multer  = require('multer');
const Schema = mongoose.Schema;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const FilmsModel = require('./server/schemas/films');
const UsersModel = require('./server/schemas/users');
const PhotoSchema = require('./server/schemas/images');
const Item = require('./server/schemas/images');
const FilmsController = require('./server/controllers/films');
const UsersController = require('./server/controllers/users');
const CategoriesController = require('./server/controllers/categories');

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

mongoose.connect(`mongodb://${process.env.DB_HOST || 'localhost'}:27017/myapir`, function (err) {
	if (err) throw err;
  console.log('Successfully connected');

	app.post('/upload', upload.single('upload'), function(req, res) {
    console.log(req.file);
		const imageOne = new PhotoSchema ({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
		})
		imageOne.save();
		let path = req.file.destination + "/" + req.file.originalname;
		console.log(path);
		res.send({"server": "server", "path": path})
	});

	app.use('/films', FilmsController);

	app.use('/users', UsersController);

	app.use('/categories', CategoriesController);

	app.listen(3012, function () {
		console.log('API app started');
	})
})
