'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
	Order.belongsTo(models.User, { foreignKey: 'UserId' });
        Order.belongsToMany(models.Product, { through: models.OrderProduct, foreignKey: 'OrderId' });
    }
  }
  Order.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    total_price: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM('cancelled','refunded','processing','shipped','delivered'),
      defaultValue: 'processing'
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
