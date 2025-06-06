'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User);
      Review.belongsTo(models.Product);
    }
  }
  Review.init({
    UserId: {
      type: DataTypes.INTEGER,
//      primaryKey: true,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    ProductId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
//      primaryKey: true,
      references: {
        model: "Product",
        key: "id",
      },
      validate: {
        isInt: { msg: 'Product id must be an integer' }
      }
    },
    textReview: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: { args: [50,255], msg: 'Review must be between 50 and 255 characters'}
      },
    },
    stars: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Min stars is 0'},
        max: { args: [10], msg: 'Max stars is 10'}
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
