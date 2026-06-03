import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ClientInfo = sequelize.define('ClientInfo', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  unique_id: { type: DataTypes.STRING, allowNull: false, unique: true },
  business_name: { type: DataTypes.STRING, allowNull: false },
  business_email: { type: DataTypes.STRING, allowNull: false },
  business_phone: { type: DataTypes.STRING, allowNull: false },
  summary: { type: DataTypes.TEXT, allowNull: true },
  logo: { type: DataTypes.STRING, allowNull: true },
  banner: { type: DataTypes.STRING, allowNull: true }
}, {
  timestamps: true,
});

export default ClientInfo;
