const { Product, Category, Sequelize: {Op} } = require("../models/index");

const { BadRequestError, NotFoundError } = require('../errors/httpErrors');

module.exports = {
	getCategoriesAndProducts: (req,res,next) => {
		const { name } = req.query;

		const nameFilter = {
			...(name ? {[Op.like]:name}:{})
		}

		Category.findAll({
			attributes: {
				exclude: ['createdAt','updatedAt']
			},
			include: [
				{ model: Product, through: { attributes: [] }, attributes: { exclude: ['createdAt','updatedAt'] }}
			],
			where: {
				...(name ? {name: nameFilter}:{})
			}
		}).then(categories => {
			res.status(200).send({message:'OK',data:categories});
		}).catch(next);
	},

	getCategoryById: (req,res,next) => {
		let id = +req.params.id;
		if(isNaN(id))
			throw new BadRequestError('id must be numeric.');
		Category.findByPk(id, {
			attributes: {
				exclude: ['createdAt','updatedAt']
			}
		}).then(category => {
			if(!category) throw new NotFoundError('Category not found');
			res.status(200).send({message:'OK',data:category});
		}).catch(next);
	},

	createCategory: (req,res,next) => {
		const { name, parent_category } = req.body;
		if(!name)
			throw new BadRequestError('Category name cannot be null');
		Category.create(req.body).then(category => {
			res.status(201).send({
				message: "Category created successfully",
				data: category
			})
		}).catch(next);
	},

	updateCategory: (req,res,next) => {
		let id = +req.params.id;
		if(isNaN(id))
			throw new BadRequestError('id must be numeric.');
		Category.update(req.body, { where: { id }})
		.then(result => {
			if(result[0] == 0) throw new NotFoundError('Category not found');
			res.status(200).send({message: "OK"});
		}).catch(next);
	},

	deleteCategory: (req,res,next) => {
		let id = +req.params.id;
		if(isNaN(id))
			throw new BadRequestError('id must be numeric.');
		Category.destroy({
			where: { id }
		}).then(result => {
			if(result == 0) throw new NotFoundError('Category not found');
			res.status(200).send({message:"OK"});
		}).catch(next)
	}
};
