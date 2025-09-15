import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'recipe_sharing_platform',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'localhost',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,

      pool: {
      max: 10, // Maximum number of connections in pool
      min: 0,  // Minimum number of connections in pool
      acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
    }
  },
);
