"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
const RatingRepository = {
    async getRatingByUserAndRecipe(recipeId, userId) {
        const result = await database_1.sequelize.query("SELECT * FROM Ratings WHERE recipe_id = :recipeId AND user_id = :userId", {
            replacements: { recipeId, userId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return result[0]; // Return the first result or undefined if not found
    },
    async addRating(recipeId, userId, rating) {
        await database_1.sequelize.query("INSERT INTO Ratings (recipe_id, user_id, rating, createdAt, updatedAt) VALUES (:recipeId, :userId, :rating, NOW(), NOW())", {
            replacements: { recipeId, userId, rating },
            type: sequelize_1.QueryTypes.INSERT,
        });
    },
    async updateRating(recipeId, userId, rating) {
        await database_1.sequelize.query("UPDATE Ratings SET rating = :rating, updatedAt = NOW() WHERE recipe_id = :recipeId AND user_id = :userId", {
            replacements: { recipeId, userId, rating },
            type: sequelize_1.QueryTypes.UPDATE,
        });
    },
    async getAverageRating(recipeId) {
        const result = await database_1.sequelize.query("SELECT AVG(rating) AS avg_rating FROM Ratings WHERE recipe_id = :recipeId", {
            replacements: { recipeId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return result[0]?.avg_rating ?? 0; // Return avg_rating or 0 if undefined
    },
    async deleteRating(ratingId) {
        await database_1.sequelize.query("DELETE FROM Ratings WHERE rate_id = :ratingId", {
            replacements: { ratingId },
            type: sequelize_1.QueryTypes.DELETE,
        });
    },
    async getRatingByIdAndUser(ratingId, userId) {
        const result = await database_1.sequelize.query("SELECT * FROM Ratings WHERE rate_id = :ratingId AND user_id = :userId", {
            replacements: { ratingId, userId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return result[0]; // Return the first result or undefined if not found
    }
};
exports.default = RatingRepository;
