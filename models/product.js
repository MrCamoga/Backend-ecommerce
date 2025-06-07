'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsToMany(models.Category,{
        through: models.ProductCategory,
      });
      Product.belongsToMany(models.Order,{
        through: models.OrderProduct
      });
      Product.hasMany(models.Review);
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name cannot be empty' }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Description cannot be empty' }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
	isInt: {
	  msg: 'Price must be an integer'
	},
        min: {
          args: [0],
          msg: 'Price must be positive'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Product',
    paranoid: true
  });
  return Product;
};
