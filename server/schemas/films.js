const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
	rank: Number,
  title: String,
  year: Number,
	votes: Number,
	rating: Number,
	categoryID: String,
});

ModelSchema.methods.toClient = function toClient() {
	const obj = this.toObject();
	// // Rename fields:
	obj.id = obj._id.toHexString();
	delete obj._id;
	return obj;
}

// Компилируем модель из схемы
const FilmsModel = mongoose.model('FilmsModel', ModelSchema );

module.exports = FilmsModel
