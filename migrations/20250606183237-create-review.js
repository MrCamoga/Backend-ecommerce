'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
	//primaryKey: true,
	references: {
		model: 'Users',
		key: 'id'
	}
      },
      ProductId: {
        type: Sequelize.INTEGER,
	//primaryKey: true,
	references: {
		model: 'Products',
		key: 'id'
	}
      },
      textReview: {
        type: Sequelize.STRING(255),
	allowNull: false
      },
      stars: {
        type: Sequelize.TINYINT,
	allowNull: false
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
    await queryInterface.dropTable('Reviews');
  }
};
