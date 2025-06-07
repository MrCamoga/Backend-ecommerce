const { User, Order, Token, Product, Sequelize: {Op}, sequelize } = require("../models/index");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendMail = require('../config/nodemailer');

const { jwt_secret, base_url } = require('../config/config.js')['development'];

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

			const confirmToken = jwt.sign({ id: user.id }, jwt_secret);
			const confirmUrl = `${base_url}/auth/confirm/${confirmToken}`;

			try {
				sendMail(req.body.email,"Email verification",`Please click the following link to confirm your email: <br> <a href="${confirmUrl}">Confirm email</a>`);
			} catch(error) {
				res.status(500).send({message:"An error ocurred while sending the confirmation email"})
			}
			res.status(201).send({ message: "Email verification sent" });
		} catch(error) {
			console.log(error)
			res.status(500).send({message: "Internal Server Error", error});
		}
	}

};
