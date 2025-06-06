const { Product, Review, User, Sequelize: {Op}} = require("../models/index");

module.exports = {
	getReviewById: (req,res,next) => {
		let id = +req.params.id;
		if(isNaN(id))
			return res.status(400).send({message:"Bad request: id must be numeric."});
		Product.findByPk(id, {
			attributes: { exclude: ['createdAt','updatedAt'] },
			include: [
				{ model: Category, attributes: { exclude: ['createdAt','updatedAt'] }, through: { attributes: [] }}
			]
		}).then(product => {
			if(product) res.status(200).send(product);
			else res.status(404).send({message: "Review not found"});
		}).catch(error => {
			res.status(500).send({message: "Internal server error", error});
		});
	},

	getProductReviews: async (req,res,next) => {
		try {
			const reviews = await Review.findAll({
				where: {
					ProductId: +req.params.id
				},
				include: [
					{ model: User, attributes: ['first_name','last_name'] }
				],
				order: [['id','ASC']]
			});
			res.status(200).send({data: reviews});
		} catch(error) {
			console.log(error);
			next(error);
		}
	},
	/*
	getUserReviews: async (req,res,next) => {
		let userid = req.params.id;
		if(userid == "me") {
			userid = req.user.id ?? null;
		}
		if(req.user.role != 'admin' && userid != req.user.id) {
			return res.status(403).send({message:'Forbidden'});
		}
		try {
			const reviews = await Review.findAll({
				where: {
					UserId: userid
				},
				include: [
					{ model: Product, attributes: ['name','description','price'] }
				],
				order: [['id','ASC']]
			});
			res.status(200).send({data: reviews});
		} catch(error) {
			console.log(error);
			next(error);
		}
	},*/

	createReview: async (req,res,next) => {
		try {
			const review = await Review.create({...req.body, UserId: req.user.id });
			res.status(201).send({message: 'Review posted successfully', data: review });
		} catch(error) {
			console.log(error);
			next(error);
		}
	},

	updateReview: async (req,res,next) => {
		let id = +req.params.id;
		// exclude product id to prevent changing the review associated product
		const {ProductId, ...body} = req.body;
		try {
			const review = await Review.findByPk(id);
			if(!review) return res.status(404).send({message: 'Review not found'});
			if(review.UserId != req.user.id) return res.status(403).send({message: 'Forbidden'});

			const [result] = await Review.update({...body, UserId: req.user.id }, {
				where: {
					id,
					UserId: req.user.id
				}
			});

			res.status(200).send({message: 'Review updated successfully', data: review });
		} catch(error) {
			console.log(error);
			next(error);
		}
	},

	deleteReview: async (req,res) => {
		let id = +req.params.id;
		try {
			const review = await Review.findByPk(id);
			if(!review) return res.status(404).send({message: 'Review not found'});
			if(review.UserId != req.user.id) return res.status(403).send({message: 'Forbidden'});

			const result = await Review.destroy({
				where: {
					id,
					UserId: req.user.id
				}
			});

			res.status(200).send({message: 'Review deleted successfully' });
		} catch(error) {
			console.log(error);
			next(error);
		}
	}
};
