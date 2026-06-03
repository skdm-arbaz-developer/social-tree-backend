import sequelize from './config/db.js';
const tables = await sequelize.getQueryInterface().showAllTables();
console.log(tables);
process.exit(0);
