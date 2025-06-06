'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.belongsToMany(models.Product,{
        through: models.ProductCategory,
      });
      Category.belongsTo(Category, {
        foreignKey: 'parent_category',
      });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Name cannot be empty' }
      }
    },
    parent_category: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categories",
        key: "id",
      },
      validate: {
        isInt: { msg: 'Parent category must be an integer' }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};
