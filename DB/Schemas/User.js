const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	id: String,
	name: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phone: {
		type: String
	},
	cardId: {
		// user's urbana card id
		type: String
	},
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date
	},
	lastUpdatedAt: {
		type: Date
	}
}, {collection: 'users' });

module.exports = exports = mongoose.model('User', UserSchema);