"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
class UserService {
    /* Register a new user */
    async register(userData) {
        const userExists = await userRepository_1.default.findByEmail(userData.email);
        if (userExists) {
            throw new Error('User already exists');
        }
        const newUser = await userRepository_1.default.create(userData);
        if (!newUser) {
            throw new Error('Failed to create user');
        }
        return newUser;
    }
    /* User login */
    async login(email, password) {
        const user = await userRepository_1.default.validateCredentials(email, password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.user_id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        return {
            user: { id: user.user_id, username: user.username, email: user.email, fullname: user.fullname },
            token,
        };
    }
    /* Get user profile by ID */
    async getProfile(id) {
        const user = await userRepository_1.default.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    /* Update user profile by ID */
    async updateProfile(id, userData) {
        const success = await userRepository_1.default.update(id, userData);
        if (!success) {
            throw new Error('Failed to update profile');
        }
        return true;
    }
    /* Delete a user by ID */
    async deleteUser(id) {
        const success = await userRepository_1.default.delete(id);
        if (!success) {
            throw new Error('Failed to delete user');
        }
        return true;
    }
}
exports.default = new UserService();
