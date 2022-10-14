'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Restuarants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sellerId: {
        type: Sequelize.INTEGER
      },
      restuarantName: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      imageFile: {
        type: Sequelize.STRING.BINARY
      },
      addressLineFirst: {
        type: Sequelize.STRING
      },
      addressLineSecond: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      landMobile: {
        type: Sequelize.STRING
      },
      frontMobile: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Restuarants');
  }
};