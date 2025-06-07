const { Product, Category, Sequelize: {Op}, sequelize } = require("../models/index");

const { BadRequestError, NotFoundError } = require('../errors/httpErrors');

module.exports = {
	getAll: (req,res,next) => {
		let {sort = 'ASC', name, price, minPrice, maxPrice} = req.query;
		if(
			(sort != 'ASC' && sort != 'DESC') ||
			(price !== undefined && isNaN(+price)) ||
			(minPrice !== undefined && isNaN(+minPrice)) ||
			(maxPrice !== undefined && isNaN(+maxPrice))
		)
			throw new BadRequestError('Invalid query params');

		const priceFilter = {
			...(minPrice !== undefined && minPrice !== '' ? {[Op.gte]: minPrice }:{}),
			...(maxPrice !== undefined && maxPrice !== '' ? {[Op.lte]: maxPrice }:{}),
			...(price    !== undefined && price    !== '' ? {[Op.eq]:  price }:{})
		}
		const nameFilter = {
			...(name ? {[Op.like]:`%${name}%`}:{})
		}

		Product.findAll({
			attributes: {
				exclude: ['createdAt','updatedAt','deletedAt']
			},
			where: {
				...(price || minPrice || maxPrice ? {price: priceFilter}:{}),
				...(name ? {name: nameFilter}:{})
			},
			include: [
				{ model: Category, attributes: { exclude: ['createdAt','updatedAt'] }, through: { attributes: [] }}
			],
			order: [
				['price',sort]
			]
		}).then(products => {
			res.status(200).send({message:'OK', data: products});
		}).catch(next);
	},

	getById: (req,res,next) => {
		let id = +req.params.id;
		if(isNaN(id))
			throw new BadRequestError('Bad Request: id must be numeric.');

		Product.findByPk(id, {
			attributes: { exclude: ['createdAt','updatedAt','deletedAt'] },
			include: [
				{ model: Category, attributes: { exclude: ['createdAt','updatedAt'] }, through: { attributes: [] }}
			]
		}).then(product => {
			if(!product) { console.log("efwfewfew");throw new NotFoundError('Product not found');}
			res.status(200).send({message:'OK', data: product });
		}).catch(next);
	},

	create: (req,res,next) => {
		const { name, description, price, categories } = req.body;

		sequelize.transaction(async (t) => {
			const product = await Product.create(req.body, { transaction: t});
			if(categories)
				await product.addCategory(categories, { transaction: t });
			return await Product.findByPk(product.id, {
				attributes: { exclude: ['createdAt','updatedAt','deletedAt'] },
				include: [{model: Category, through: { attributes: [] }, attributes: { exclude: ['createdAt','updatedAt'] }}],
				transaction: t
			});
		}).then(product => {
			res.status(201).send({
				message: "Product created successfully",
				data: product
			})
		}).catch(next);
	},

	updateById: (req,res,next) => {
		let id = +req.params.id;
		const { categories } = req.body;
		if(isNaN(id))
			throw new BadRequestError('id must be numeric');
		sequelize.transaction(async (t) => {
			const result = await Product.update(req.body, { where: { id }, transaction: t });
			if(categories && result[0]) {
				const product = await Product.findByPk(id, { transaction: t });
				await product.setCategories(categories, { transaction: t });
			}
			return result;
		}).then(result => {
			if(result[0] == 0) throw new NotFoundError('Product not found');
			res.status(200).send({message: "OK"});
		}).catch(next);
	},

	deleteById: (req,res,next) => {
		let id = +req.params.id;
		if(isNaN(id))
			throw new BadRequestError('id must be numeric');
		Product.destroy({
			where: { id }
		}).then(result => {
			if(result == 0) throw new NotFoundError('Product not found');
			res.status(200).send({message:"OK"});
		}).catch(next)
	}
};
