const { Order, Product, OrderProduct, Sequelize: {Op}, sequelize } = require("../models/index");

const { BadRequestError, NotFoundError } = require("../errors/httpErrors");

module.exports = {
	getOrders: (req,res,next) => {
		Order.findAll({
			attributes: { exclude: ['updatedAt'] },
			include: [
				{ model: Product, attributes: { exclude: ['createdAt','updatedAt','deletedAt']}, through: { attributes: ['quantity','unit_price']}}
			],
			order: [['id','ASC']]
		}).then(orders => {
			res.status(200).send({message:'OK', data: orders});
		}).catch(next);
	},

	createOrder: (req,res,next) => {
		const items = req.body.items ?? []; // items: array of tuples [productId,quantity]

		sequelize.transaction(async (t) => {
			if(!Array.isArray(items) || items.length == 0) throw new BadRequestError('Cart is empty'); // 400
			// Obtener precios actual de productos
			const products = await Product.findAll({
				attributes: { include: ['id','name','price'] },
				where: { id: items.map(item => item[0]) },
				transaction: t
			});

			// mapear productos de la db a objetos para insertar a OrderProducts
			let total_price = 0;

			const productData = items.map(row => {
				let [ProductId, quantity] = row;
				ProductId = +ProductId;
				if(isNaN(ProductId)) throw new BadRequestError(`Product id must be numeric`)
				const product = products.find(p => p.id == ProductId);
				if(!product) throw new NotFoundError(`Product with ID ${ProductId} not found`);
				total_price += quantity*product.price;
				return {
					ProductId,
					quantity,
					unit_price: product.price
				}
			});

			// Inserción de producto
			const order = await Order.create({total_price, UserId: req.user.id}, { transaction: t });
			// TODO catch primary key unique violation to return bad request (repeated item in cart). or combine repeated ids in productData
			const res = await OrderProduct.bulkCreate(productData.map(p => ({...p, OrderId: order.id })), { transaction: t, validate: true });
			return await Order.findByPk(order.id, {
				attributes: { exclude: ['createdAt','updatedAt'] },
				include: [{model: Product, through: { attributes: ['quantity','unit_price'] }, attributes: { exclude: ['createdAt','updatedAt','deletedAt'] }}],
				transaction: t
			});
		}).then(order => {
			res.status(201).send({message: "Order created successfully", data: order});
		}).catch(next);
	}
};
