const { User, Order, Product, Sequelize: {Op}, sequelize } = require("../models/index");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { jwt_secret } = require('../config/config.js')['development'];

module.exports = {
	getOrders: (req,res,next) => {
		User.findByPk(req.user.id, {
			attributes: {
				include: ['first_name','last_name','email','createdAt']
			},
			include: [
				{ model: Order, attributes: { exclude: ['updatedAt'] }, include: [
					{ model: Product, attributes: { exclude: ['createdAt','updatedAt']}, through: { attributes: ['quantity','unit_price']}}
				]}
			]
		}).then(userProducts => {
			res.status(200).send(userProducts);
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	},

	signUp: (req,res,next) => {
		if(!req.body.password) return res.status(400).send({message:'Bad Request - Password is missing'});
		const password = bcrypt.hashSync(req.body.password,10);
		console.log(password)
		User.create({...req.body,password}).then(user => {
			const token = jwt.sign({ id: user.id }, jwt_secret);
			res.status(201).send({
				message: "User created successfully",
				user,
				token
			})
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error", error});
		});
	}

};
