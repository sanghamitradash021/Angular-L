"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'recipe_sharing_platform', process.env.DB_USER || 'root', process.env.DB_PASSWORD || 'localhost', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 10, // Maximum number of connections in pool
        min: 0, // Minimum number of connections in pool
        acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
        idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
    }
});
