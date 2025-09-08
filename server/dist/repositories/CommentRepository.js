"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const comment_1 = __importDefault(require("../models/comment"));
class CommentRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(comment_1.default);
    }
    async findByRecipeId(recipeId) {
        return await this.model.findAll({
            where: { recipe_id: recipeId },
            order: [['createdAt', 'DESC']]
        });
    }
    async findByUserId(userId) {
        return await this.model.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']]
        });
    }
}
exports.CommentRepository = CommentRepository;
