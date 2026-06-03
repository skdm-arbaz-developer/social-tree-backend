import sequelize from '../config/db.js';
import User from './User.js';
import ClientInfo from './ClientInfo.js';
import SocialMedia from './SocialMedia.js';

User.hasOne(ClientInfo, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ClientInfo.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(SocialMedia, { foreignKey: 'user_id', onDelete: 'CASCADE' });
SocialMedia.belongsTo(User, { foreignKey: 'user_id' });

const syncDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export {
  sequelize,
  User,
  ClientInfo,
  SocialMedia,
  syncDB
};
