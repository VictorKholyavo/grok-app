const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: String,
  age: Number,
  gender: String,
	company: String,
	favoriteFruit: String,
});

UserSchema.methods.toClient = function toClient() {
	const obj = this.toObject();
	// // Rename fields:
	obj.id = obj._id.toHexString();
	delete obj._id;
	return obj;
}

// Компилируем модель из схемы
const UsersModel = mongoose.model('UsersModel', UserSchema );

module.exports = UsersModel
