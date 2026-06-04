import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const SocialMedia = sequelize.define('SocialMedia', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  platform: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.TEXT, allowNull: false },
  icon_url: { type: DataTypes.STRING, allowNull: true },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  timestamps: true,
});

export default SocialMedia;
