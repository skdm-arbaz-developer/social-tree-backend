import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  profile_image: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.ENUM('superadmin', 'client'), defaultValue: 'client', allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
  reset_otp: { type: DataTypes.STRING, allowNull: true },
  reset_otp_expires: { type: DataTypes.DATE, allowNull: true }
}, {
  timestamps: true,
});

export default User;
