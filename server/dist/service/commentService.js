"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commentRepository_1 = __importDefault(require("../repositories/commentRepository"));
class CommentService {
    /* Add a new comment to a recipe */
    async addComment(recipeId, userId, content) {
        return await commentRepository_1.default.addComment(recipeId, userId, content);
    }
    /* Get all comments for a specific recipe */
    async getComments(recipeId) {
        return await commentRepository_1.default.getCommentsByRecipe(recipeId);
    }
    /* Update an existing comment */
    async updateComment(commentId, userId, content) {
        const existingComment = await commentRepository_1.default.getCommentByIdAndUser(commentId, userId);
        if (!existingComment) {
            throw new Error('Comment not found or unauthorized');
        }
        await commentRepository_1.default.updateComment(commentId, content);
    }
    /* Delete a comment */
    async deleteComment(commentId, userId) {
        const existingComment = await commentRepository_1.default.getCommentByIdAndUser(commentId, userId);
        if (!existingComment) {
            throw new Error('Comment not found or unauthorized');
        }
        await commentRepository_1.default.deleteComment(commentId);
    }
}
exports.default = new CommentService();
