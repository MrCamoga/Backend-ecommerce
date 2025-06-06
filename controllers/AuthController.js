const { User, Token, Sequelize: {Op}, sequelize } = require("../models/index");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwt_secret } = require('../config/config.js')['development'];

module.exports = {
	login: (req,res,next) => {
		User.findOne({ where: { email: req.body.email }, attributes: {include: ['first_name','last_name','email','createdAt']}}).then(user => {
			// dummy password if user is not found to prevent a timing attack
			const passwordsEqual = bcrypt.compareSync(req.body.password, user.password ?? '$2a$10$j.NJYLehXvr/ehpgoTvQ0OO2N8as45Iv0JgZbSPf6lrpUmUAbFhfS');

			if(!user || !passwordsEqual) return res.status(404).send({message: 'Wrong email or password'});

			const tokenRecord = await Token.create({ UserId: user.id });
			const token = jwt.sign({ id: user.id, token_id: tokenRecord.id }, jwt_secret);
			res.send({message: `Welcome ${user.first_name}`, user, token});
		}).catch(error => {
			console.log(error)
			res.status(500).send({message: 'Internal Server Error', error});
		})
	},

	logout: (req,res,next) => {
		
	}
};
