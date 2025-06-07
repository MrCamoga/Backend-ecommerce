const { User, Token, Sequelize: {Op}, sequelize } = require("../models/index");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwt_secret } = require('../config/config.js')['development'];

module.exports = {
	login: async (req,res,next) => {
		try {
			const user = await User.findOne({
				where: { email: req.body.email },
				attributes: {include: ['first_name','last_name','role','email','password','createdAt']}
			});
			// dummy password if user is not found to prevent a timing attack
			const passwordsEqual = bcrypt.compareSync(req.body.password, user.password ?? '$2a$10$j.NJYLehXvr/ehpgoTvQ0OO2N8as45Iv0JgZbSPf6lrpUmUAbFhfS');

			if(!user || !passwordsEqual) return res.status(404).send({message: 'Wrong email or password'});

			const tokenRecord = await Token.create({ UserId: user.id });
			const token = jwt.sign({ id: user.id, token_id: tokenRecord.id }, jwt_secret);
			delete user.dataValues.password;
			res.send({message: `Welcome ${user.first_name}`, user, token});
		} catch(error) {
			console.log(error)
			res.status(500).send({message: 'Internal Server Error', error});
		}
	},

	logout: async (req,res,next) => {
		try {
			if(req.headers.authorization) {
				const { token_id } = jwt.verify(req.headers.authorization, jwt_secret);
				const result = await Token.destroy({ where: { id: token_id }});
				if(result > 0) return res.send({ message: 'Logged out' });
			}
			return res.status(401).send({ message: 'Unauthorized' });
		} catch(error) {
			console.log(error);
			res.status(500).send({ message: 'Error while logging out' });
		}
	},

	confirm: async (req,res,next) => {
		try {
			try {
				var { id } = jwt.verify(req.params.token, jwt_secret);
			} catch(error) {
				return res.status(401).send({message: error.message});
			}
			const result = await User.update({verified: 1}, { where: { id }});
			if(result[0] > 0) return res.status(200).send({message:'Email verified'});
		} catch(error) {
			console.log(error);
			next(error);
		}
	}
};
