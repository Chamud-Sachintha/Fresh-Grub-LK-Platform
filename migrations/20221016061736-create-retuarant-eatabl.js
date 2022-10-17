'use strict';
/** @type {import('sequelize-cli').Migration} */

const db = require("../models")

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RetuarantEatabls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eatableId: {
        type: Sequelize.INTEGER,
      },
      restuarantId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('RetuarantEatabls');
  }
};