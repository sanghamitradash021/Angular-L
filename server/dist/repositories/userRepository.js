"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserRepository {
    async create(userData) {
        const { username, email, password, fullname, role } = userData;
        // Hash the password if it exists
        const hashedPassword = password ? await bcrypt_1.default.hash(password, 10) : null;
        const result = await database_1.sequelize.query(`INSERT INTO Users (username, email, password, fullname, role, createdAt, updatedAt)
             VALUES (:username, :email, :password, :fullname, :role, NOW(), NOW())`, {
            replacements: {
                username,
                email,
                password: hashedPassword,
                fullname,
                role,
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
        // Retrieve the last inserted ID
        const [idResult] = await database_1.sequelize.query("SELECT LAST_INSERT_ID() as id", {
            type: sequelize_1.QueryTypes.SELECT,
        });
        const user_id = idResult.id;
        if (!user_id)
            return null;
        return this.findById(user_id);
    }
    async findById(id) {
        const [user] = await database_1.sequelize.query("SELECT * FROM Users WHERE user_id = :id", {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return user ? user : null;
    }
    async findByEmail(email) {
        const [user] = await database_1.sequelize.query("SELECT * FROM Users WHERE email = :email", {
            replacements: { email },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return user ? user : null;
    }
    async validateCredentials(email, password) {
        const user = await this.findByEmail(email);
        if (!user || !user.password)
            return null;
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        return isPasswordValid ? user : null;
    }
    async update(id, userData) {
        const { username, email, password, fullname, role } = userData;
        let hashedPassword = undefined;
        if (password) {
            hashedPassword = await bcrypt_1.default.hash(password, 10);
        }
        const result = await database_1.sequelize.query(`UPDATE Users SET username = :username, email = :email, 
             password = COALESCE(:password, password), fullname = :fullname, role = :role, updatedAt = NOW() 
             WHERE user_id = :id`, {
            replacements: { id, username, email, password: hashedPassword, fullname, role },
            type: sequelize_1.QueryTypes.UPDATE,
        });
        const affectedRows = Array.isArray(result) ? result[1] : 0;
        return affectedRows > 0;
    }
    async delete(id) {
        const result = await database_1.sequelize.query("DELETE FROM Users WHERE user_id = :id", { replacements: { id }, type: sequelize_1.QueryTypes.DELETE });
        const affectedRows = Array.isArray(result) ? result[1] : 0;
        return affectedRows > 0;
    }
}
exports.default = new UserRepository();
