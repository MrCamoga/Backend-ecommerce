const { Order, Product, OrderProduct, Sequelize: {Op}, sequelize } = require("../models/index");

module.exports = {
	getOrders: (req,res,next) => {
		Order.findAll({
			attributes: { exclude: ['updatedAt'] },
			include: [
				{ model: Product, attributes: { exclude: ['createdAt','updatedAt']}, through: { attributes: []}}
			],
			order: [['id','ASC']]
		}).then(orders => {
			res.status(200).send(orders);
		}).catch(error => {
			res.status(500).send({message:'Internal Server Error',error});
		});
	},

	createOrder: (req,res,next) => {
		const items = req.body.items ?? []; // items: array of tuples [productId,quantity]

		sequelize.transaction(async (t) => {
			if(!Array.isArray(items) || items.length == 0) throw new Error('Cart is empty'); // 400
			// Obtener precios actual de productos
			const products = await Product.findAll({
				attributes: { include: ['id','name','price'] },
				where: { id: items.map(item => item[0]) },
				transaction: t
			});
			// mapear productos de la db a objetos para insertar a OrderProducts
			let total_price = 0;

			const productData = items.map(row => {
				const product = products.find(p => p.id == row[0]);
				if(!product) throw new Error(`Product ${name} with ID ${row.id} not found`); // 404
				total_price += row[1]*product.price;
				return {
					ProductId: row[0],
					quantity: row[1],
					unit_price: product.price
				}
			});

			console.log(total_price)

			// Inserción de producto
			const order = await Order.create({...req.body, total_price}, { transaction: t });
			const res = await OrderProduct.bulkCreate(productData.map(p => ({...p, OrderId: order.id })), { transaction: t });
			return await Order.findByPk(order.id, {
				attributes: { exclude: ['createdAt','updatedAt'] },
				include: [{model: Product, through: { attributes: [] }, attributes: { exclude: ['createdAt','updatedAt'] }}],
				transaction: t
			});
		}).then(result => {
			res.status(201).send({message: "OK"});
		}).catch(error => {
			res.status(500).send({message: "Internal Server Error",error});
		});
	}
};
