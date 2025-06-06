'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderProduct.belongsTo(models.Order, { foreignKey: 'OrderId' });
      OrderProduct.belongsTo(models.Product, { foreignKey: 'ProductId' });
    }
  }
  OrderProduct.init({
    OrderId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      primaryKey: true,
      references: {
        model: "Order",
        key: "id",
      }
    },
    ProductId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      primaryKey: true,
      references: {
        model: "Product",
        key: "id",
      },
      validate: {
        isInt: { msg: 'Product id must be an integer' }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Product quantity must be positive'
        },
        isInt: { msg: 'Quantity must be an integer' }
      }
    },
    unit_price: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'OrderProduct',
  });
  return OrderProduct;
};
