'use strict'

const User = require('../DB/Schemas/User');

module.exports = function(server) {

	/**
	 * Login
	 */
	server.post('/user/login', (req, res, next) => {
		// TODO: integrate secure method for login (e.g. passport)
		res.send(200, {'message': 'Login response'});
		next();
	});


	/**
	 * SignUp
	 */
	server.post('/user/create', (req, res, next) => {
		const data = req.body || {};

		// validate data
		if (!data.name || !data.surname || !data.email || !data.password) {
			//missing data
			res.send(500, {'message': 'Unable to create new user! Data is incomplete.'});
		} else {
			data.createdAt = new Date();
			data.lastUpdatedAt = new Date();

			// TODO: for now mongoose schema takes care of email duplications - maybe check can be done at this level where message will be sent to the user
			// TODO: password should be encrypted

			User.create(data)
				.then(usr => {
					res.send(200, usr);
					next();
				})
				.catch(err => {
					res.send(500, err);
				});
		}
	});

	/**
	 * Get single user
	 */
	server.get('/user/:userId', (req, res, next) => {

		if (!req.params.userId) {
			res.send(500, {'message': 'Required parameter userId is missing.'});
		}

		User.findById(req.params.userId)
			.then(user => {
				if (!user) res.send(404, {'message': `User with id ${req.params.userId} was not found.`});
				else res.send(200, user);
				next();
			})
			.catch(err => {
				res.send(500, err);
			});
	});

	/**
	 * Update user's account
	 */
	server.put('/user/:userId', (req, res, next) => {

		if (!req.params.userId) {
			res.send(500, {'message': 'Required parameter userId is missing.'});
		}

		let data = req.body || {};

		User.update({ _id: req.params.userId}, data)
			.then(user => {
				res.send(200, user);
				next();
			})
			.catch(err => {
				res.send(500, err);
			});
	});

	/**
	 * Delete user's account
	 */
	server.del('/user/:userId', (req, res, next) => {

		if (!req.params.userId) {
			res.send(500, {'message': 'Required parameter userId is missing.'});
		}

		User.findOneAndRemove({ _id: req.params.userId })
			.then(() => {
				res.send(200, { 'message': `User with _id ${req.params.userId} has been deleted.`});
				next();
			})
			.catch(err => {
				res.send(500, err);
			});

	});
};