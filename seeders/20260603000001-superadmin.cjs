'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('Users', [{
      name: 'Arbaz Ansari',
      username: 'admin',
      email: 'ansariarbaz254@gmail.com',
      phone: '9320134389',
      password: hashedPassword,
      role: 'superadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { username: 'admin' }, {});
  }
};
