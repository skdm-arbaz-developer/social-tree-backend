import { sequelize } from './models/index.js';

async function sync() {
  await sequelize.sync({ alter: true });
  console.log('Database synced successfully with alter:true');
  process.exit(0);
}

sync();
