const { User, Order, Product, Sequelize: {Op}, sequelize } = require("../models/index");

//const { jwt } = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
	getOrders: (req,res,next) => {
		// TODO authentication
		User.findByPk(req.userId, {
			attributes: {
				include: ['first_name','last_name','email','createdAt']
			},
			include: [
				{ model: Order, attributes: { exclude: ['updatedAt'] }, include: [
					{ model: Product, attributes: { exclude: ['createdAt','updatedAt']}, through: { attributes: ['quantity','unit_price']}}
				]}
			]
		}).then(products => {
			res.status(200).send(products);
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	},

	signUp: (req,res,next) => {
		if(!req.body.password) next(new Error('400 Bad Request - Password missing'));
		const password = bcrypt.hashSync(req.body.password,10);
		console.log(password)
		User.create({...req.body,password}).then(user => {
			res.status(201).send({
				message: "User created successfully",
				user
			})
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	}

};
