'use strict'

const User = require('../DB/Schemas/User');

module.exports = function(server) {

	/**
	 * Login
	 */
	server.post('/login', (req, res, next) => {
		res.send(200, {'message': 'Login response'});
		next();
	});


	/**
	 * SignUp
	 */
	server.post('/signup', (req, res, next) => {
		const data = req.body || {};

		// validate data
		if (!data.name || !data.surname || !data.email || !data.password) {
			//missing data
			res.send(500, {'message': 'Unable to create new user! Data is incomplete.'});
		} else {
			data.createdAt = new Date();
			data.lastUpdatedAt = new Date();

			//TODO: check if user with provided email already exists

			console.log("DATA: ", data);

/*			User.create(data, function (err, content) {
				if (err) res.send(500, err);
				// saved!

				res.send(200, content);
				next();
			});*/

			User.create(data)
				.then(usr => {
					console.log("AAAAAAAAAAAAAAAAAA", usr);
					res.send(200, usr);
					next();
				})
				.catch(err => {
					res.send(500, err);
				})
		}
	});
};