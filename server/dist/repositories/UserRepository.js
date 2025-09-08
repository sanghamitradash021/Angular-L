"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(user_1.default);
    }
    async findByEmail(email) {
        return await this.model.findOne({
            where: { email }
        });
    }
    async validateCredentials(email, password) {
        const user = await this.findByEmail(email);
        if (!user)
            return null;
        const isValid = await bcrypt_1.default.compare(password, user.password);
        return isValid ? user : null;
    }
    async create(userData) {
        if (userData.password) {
            const salt = await bcrypt_1.default.genSalt(10);
            userData.password = await bcrypt_1.default.hash(userData.password, salt);
        }
        return await super.create(userData);
    }
    async update(id, userData) {
        if (userData.password) {
            const salt = await bcrypt_1.default.genSalt(10);
            userData.password = await bcrypt_1.default.hash(userData.password, salt);
        }
        return await super.update(id, userData);
    }
}
exports.UserRepository = UserRepository;
