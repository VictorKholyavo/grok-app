const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	category: String,
});

CategorySchema.methods.toClient = function toClient() {
	const obj = this.toObject();
	// // Rename fields:
	obj.id = obj._id.toHexString();
	delete obj._id;
	return obj;
}

// Компилируем модель из схемы
const CategoriesModel = mongoose.model('CategoriesModel', CategorySchema );

module.exports = CategoriesModel
