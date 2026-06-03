'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClientInfos', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      unique_id: { type: Sequelize.STRING, allowNull: false, unique: true },
      business_name: { type: Sequelize.STRING, allowNull: false },
      business_email: { type: Sequelize.STRING, allowNull: false },
      business_phone: { type: Sequelize.STRING, allowNull: false },
      summary: { type: Sequelize.TEXT, allowNull: true },
      logo: { type: Sequelize.STRING, allowNull: true },
      banner: { type: Sequelize.STRING, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ClientInfos');
  }
};
