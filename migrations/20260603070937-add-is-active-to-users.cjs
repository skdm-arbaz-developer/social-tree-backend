'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('Users', 'is_active', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      });
    } catch (error) {
      console.log("Column may already exist, ignoring error:", error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('Users', 'is_active');
    } catch (error) {}
  }
};
