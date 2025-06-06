const { User, Order, Token, Product, Sequelize: {Op}, sequelize } = require("../models/index");

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

	signUp: async (req,res,next) => {
		try {
			if(!req.body.password) return res.status(400).send({message:'Bad Request - Password is missing'});
			const password = bcrypt.hashSync(req.body.password,10);
			console.log(password)
			const user = await User.create({...req.body,password,role:'user'});
			if(user.id == 1) { // First user gets admin!
				user.update({role:'admin'});
			}
			const tokenRecord = await Token.create({ UserId: user.id });
			const token = jwt.sign({ id: user.id, token_id: tokenRecord.id }, jwt_secret);

			delete user.dataValues.password;
			res.status(201).send({
				message: "User created successfully",
				user,
				token
			});
		} catch(error) {
			console.log(error)
			res.status(500).send({message: "Internal Server Error", error});
		}
	}

};
