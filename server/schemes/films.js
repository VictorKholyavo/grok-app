const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
	rank: String,
  title: String,
  year: String,
	votes: String,
	rating: String,
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
