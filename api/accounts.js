'use strict';

const bcrypt = require('bcryptjs');
const axios = require('axios');

const User = require('../DB/Schemas/User');

module.exports = function (server) {

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

			// TODO: for now mongoose schema takes care of email and cardId duplications - maybe check can be done at this level where message will be sent to the user

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(data.password, salt, (err, hash) => {
					// Hash password
					data.password = hash;
					User.create(data)
						.then(usr => {

							// new user has been created successfully, now create him credit account for payment
							// call payment api
							// TODO: url to global config
							axios.post('http://lpp-payment-service:85/creditAccount/create', {
								user: usr._id,
								cardId: usr.cardId
							})
							.then(response => {
								res.send(200, usr);
								next();
							})
							.catch(error => {
								console.log(error);
								res.send(500, error);
							});
						})
						.catch(err => {
							res.send(500, err);
						});
				});
			});
		}
	});

	/**
	 * Login
	 */
	server.post('/user/login', (req, res, next) => {
		if (!req.body.email || !req.body.password) {
			res.send(500, {'message': 'Unable to authenticate user! Required parameters are missing.'});
		} else {
			// get user by email
			User.findOne({email: req.body.email})
				.then(user => {
					if (!user) {
						res.send(404, {'message': 'Login failed. User with provided credentials has not been found.'});
					}

					// Match password
					bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
						if (err) {
							res.send(500, err);
						} else if (isMatch) {
							res.send(200, user);
							next();
						} else {
							res.send(404, {'message': 'Login failed. User with provided credentials has not been found.'});
						}
					});
				})
				.catch(err => {
					res.send(500, err);
				});
		}
	});

	/**
	 * Login with Urbana card
	 */
	server.post('/user/cardLogin', (req, res, next) => {
		if (!req.body.cardId) {
			res.send(500, {'message': 'Required parameter cardId is missing.'});
		}

		User.findOne({cardId: req.body.cardId})
			.then(user => {
				if (!user) res.send(404, {'message': `User with provided cardId ${req.body.cardId} was not found.`});
				else res.send(200, user);
				next();
			})
			.catch(err => {
				res.send(500, err);
			});
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

		User.update({_id: req.params.userId}, data)
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

		User.findOneAndRemove({_id: req.params.userId})
			.then(() => {
				// user's account has been deleted successfully, delete his credit account too
				// call payment api
				// TODO: url to global config
				axios.delete(`http://lpp-payment-service:85/creditAccount/${req.params.userId}`)
					.then((response) => {
						res.send(200, {'message': `User with _id ${req.params.userId} has been deleted.`});
						next();
					})
					.catch(error => {
						console.log(error);
						res.send(500, error);
					});
			})
			.catch(err => {
				res.send(500, err);
			});

	});
};