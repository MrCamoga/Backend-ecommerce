'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Order);
      User.hasMany(models.Token);
      User.hasMany(models.Review);
    }
  }
  User.init({
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'First name cannot be empty' },
        notNull: { msg: 'First name cannot be null' },
        len: {
          args: [1,50],
          msg: 'Length cannot exceed 50 characters'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'First name cannot be empty' },
        notNull: { msg: 'First name cannot be null' },
        len: {
          args: [1,50],
          msg: 'Length cannot exceed 50 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Invalid email'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('user','admin'),
      defaultValue: 'user'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
