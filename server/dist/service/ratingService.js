"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ratingRepository_1 = __importDefault(require("../repositories/ratingRepository"));
class RatingService {
    /* Add or update a rating for a recipe by a user */
    async addOrUpdateRating(recipeId, userId, rating) {
        if (!recipeId || !userId || rating === undefined) {
            throw new Error('Missing required fields: recipeId, userId, or rating');
        }
        if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        const existingRating = await ratingRepository_1.default.getRatingByUserAndRecipe(recipeId, userId);
        if (existingRating) {
            await ratingRepository_1.default.updateRating(recipeId, userId, rating);
            return { message: 'Rating updated successfully', rating, recipeId, isNew: false };
        }
        else {
            await ratingRepository_1.default.addRating(recipeId, userId, rating);
            return { message: 'Rating added successfully', rating, recipeId, isNew: true };
        }
    }
    /* Get the average rating for a recipe */
    async getAverageRating(recipeId) {
        if (!recipeId) {
            throw new Error('Recipe ID is required');
        }
        return await ratingRepository_1.default.getAverageRating(recipeId);
    }
    /* Get a user's rating for a specific recipe */
    async getUserRating(recipeId, userId) {
        if (!recipeId || !userId) {
            throw new Error('Recipe ID and User ID are required');
        }
        const userRating = await ratingRepository_1.default.getRatingByUserAndRecipe(recipeId, userId);
        return userRating ? userRating.rating : 0;
    }
    /* Update an existing rating */
    async updateRating(ratingId, userId, rating) {
        const existingRating = await ratingRepository_1.default.getRatingByIdAndUser(ratingId, userId);
        if (!existingRating) {
            throw new Error('Rating not found or unauthorized');
        }
        await ratingRepository_1.default.updateRating(existingRating.recipe_id, userId, rating);
    }
    /* Delete a rating */
    async deleteRating(ratingId, userId) {
        const existingRating = await ratingRepository_1.default.getRatingByIdAndUser(ratingId, userId);
        if (!existingRating) {
            throw new Error('Rating not found or unauthorized');
        }
        await ratingRepository_1.default.deleteRating(ratingId);
    }
}
exports.default = new RatingService();
