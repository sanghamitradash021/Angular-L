import { sequelize } from "../config/database";
import { QueryTypes } from "sequelize";

interface Rating {
    recipe_id: number;
    user_id: number;
    rating: number;
    rate_id: number;
    createdAt: Date;
    updatedAt: Date;
}

const RatingRepository = {
    async getRatingByUserAndRecipe(recipeId: number, userId: number): Promise<Rating | undefined> {
        const result = await sequelize.query<Rating>(
            "SELECT * FROM Ratings WHERE recipe_id = :recipeId AND user_id = :userId",
            {
                replacements: { recipeId, userId },
                type: QueryTypes.SELECT,
            }
        );
        return result[0]; // Return the first result or undefined if not found
    },

    async addRating(recipeId: number, userId: number, rating: number) {
        await sequelize.query(
            "INSERT INTO Ratings (recipe_id, user_id, rating, createdAt, updatedAt) VALUES (:recipeId, :userId, :rating, NOW(), NOW())",
            {
                replacements: { recipeId, userId, rating },
                type: QueryTypes.INSERT,
            }
        );
    },

    async updateRating(recipeId: number, userId: number, rating: number) {
        await sequelize.query(
            "UPDATE Ratings SET rating = :rating, updatedAt = NOW() WHERE recipe_id = :recipeId AND user_id = :userId",
            {
                replacements: { recipeId, userId, rating },
                type: QueryTypes.UPDATE,
            }
        );
    },

    async getAverageRating(recipeId: number): Promise<number> {
        const result = await sequelize.query<{ avg_rating: number }>(
            "SELECT AVG(rating) AS avg_rating FROM Ratings WHERE recipe_id = :recipeId",
            {
                replacements: { recipeId },
                type: QueryTypes.SELECT,
            }
        );
        return result[0]?.avg_rating ?? 0; // Return avg_rating or 0 if undefined
    },

    async deleteRating(ratingId: number) {
        await sequelize.query(
            "DELETE FROM Ratings WHERE rate_id = :ratingId",
            {
                replacements: { ratingId },
                type: QueryTypes.DELETE,
            }
        );
    },

    async getRatingByIdAndUser(ratingId: number, userId: number): Promise<Rating | undefined> {
        const result = await sequelize.query<Rating>(
            "SELECT * FROM Ratings WHERE rate_id = :ratingId AND user_id = :userId",
            {
                replacements: { ratingId, userId },
                type: QueryTypes.SELECT,
            }
        );
        return result[0]; // Return the first result or undefined if not found
    }
};

export default RatingRepository;
