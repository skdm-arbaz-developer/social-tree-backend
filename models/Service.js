import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  service_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  short_desc: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'Services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Service;
