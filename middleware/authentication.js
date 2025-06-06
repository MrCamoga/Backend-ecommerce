const { User, Token, Sequelize: {Op} } = require('../models');
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/config.js')['development'];

const authentication = async (req,res,next) => {
	try {
		const token = req.headers.authorization;
		console.log(req.headers)
		const token_payload = jwt.verify(token, jwt_secret);
		const user = await User.findByPk(token_payload.id);
		const tokenRecord = await Token.findByPk(token_payload.token_id);
		if(!tokenRecord) {
			return res.status(401).send({ message: 'Unauthorized'});
		}
		req.user = user; // TODO store jwt tokenid?
		next();
	} catch(error) {
		console.log(error);
		res.status(500).send({message:'Error validating login token', error});
	}
}

module.exports = { authentication };
