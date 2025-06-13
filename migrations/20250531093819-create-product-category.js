'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductCategories', {
      ProductId: {
        type: Sequelize.INTEGER,
	references: {
		model: 'Products',
		key: 'id'
	},
	onDelete: 'CASCADE',
	primaryKey: true
      },
      CategoryId: {
        type: Sequelize.INTEGER,
	references: {
		model: 'Categories',
		key: 'id'
	},
	onDelete: 'CASCADE',
	primaryKey: true
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
    await queryInterface.dropTable('ProductCategories');
  }
};
