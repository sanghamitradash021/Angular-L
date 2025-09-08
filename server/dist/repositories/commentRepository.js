"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
const CommentRepository = {
    async addComment(recipeId, userId, content) {
        // Insert the comment and get the inserted ID
        const insertResult = await database_1.sequelize.query(`INSERT INTO Comments (recipe_id, user_id, content, createdAt, updatedAt)
            VALUES (:recipeId, :userId, :content, NOW(), NOW())`, {
            replacements: { recipeId, userId, content },
            type: sequelize_1.QueryTypes.INSERT,
        });
        // Get the newly inserted comment with all details
        const [newComment] = await database_1.sequelize.query(`SELECT c.comment_id, c.recipe_id, c.user_id, c.content, c.createdAt, c.updatedAt, u.username
             FROM Comments c
             INNER JOIN Users u ON c.user_id = u.user_id
             WHERE c.comment_id = LAST_INSERT_ID()`, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        return newComment;
    },
    async getCommentsByRecipe(recipeId) {
        const result = await database_1.sequelize.query(`SELECT c.comment_id, c.recipe_id, c.user_id, c.content, c.createdAt, c.updatedAt, u.username
             FROM Comments c
             INNER JOIN Users u ON c.user_id = u.user_id
             WHERE c.recipe_id = :recipeId
             ORDER BY c.createdAt DESC`, {
            replacements: { recipeId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return result;
    },
    async getCommentByIdAndUser(commentId, userId) {
        const result = await database_1.sequelize.query("SELECT * FROM Comments WHERE comment_id = :commentId AND user_id = :userId", {
            replacements: { commentId, userId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return result[0]; // Return the first result or undefined if not found
    },
    async updateComment(commentId, content) {
        await database_1.sequelize.query("UPDATE Comments SET content = :content, updatedAt = NOW() WHERE comment_id = :commentId", {
            replacements: { content, commentId },
            type: sequelize_1.QueryTypes.UPDATE,
        });
    },
    async deleteComment(commentId) {
        await database_1.sequelize.query("DELETE FROM Comments WHERE comment_id = :commentId", {
            replacements: { commentId },
            type: sequelize_1.QueryTypes.DELETE,
        });
    },
};
exports.default = CommentRepository;
