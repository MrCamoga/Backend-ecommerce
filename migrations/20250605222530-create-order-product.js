'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderProducts', {
      OrderId: {
        type: Sequelize.INTEGER,
	primaryKey: true,
	references: {
		model: 'Orders',
		key: 'id'
	}
      },
      ProductId: {
        type: Sequelize.INTEGER,
	primaryKey: true,
	references: {
		model: 'Products',
		key: 'id'
	}
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      unit_price: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderProducts');
  }
};
