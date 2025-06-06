const { User, Sequelize: {Op}, sequelize } = require("../models/index");

const bcrypt = require('bcryptjs');

module.exports = {
	login: (req,res,next) => {
		User.findOne({ where: { email: req.body.email }, attributes: {include: ['first_name','last_name','email','createdAt']}}).then(user => {
			// dummy password if user is not found to prevent a timing attack
			const passwordsEqual = bcrypt.compareSync(req.body.password, user.password ?? '$2a$10$j.NJYLehXvr/ehpgoTvQ0OO2N8as45Iv0JgZbSPf6lrpUmUAbFhfS');

			if(!user || !passwordsEqual) return res.status(404).send({message: 'Wrong email or password'});

			res.send(user);
		}).catch(error => {
			console.log(error)
			res.status(500).send({message: 'Internal Server Error', error});
		})
	},

	logout: (req,res,next) => {

	}
};
