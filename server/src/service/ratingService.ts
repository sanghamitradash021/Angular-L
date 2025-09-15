import RatingRepository from '../repositories/ratingRepository';

class RatingService {
/* Add or update a rating for a recipe by a user */ 

  async addOrUpdateRating(recipeId: number, userId: number, rating: number): Promise<{ message: string; rating: number; recipeId: number; isNew: boolean }> {
    if (!recipeId || !userId || rating === undefined) {
      throw new Error('Missing required fields: recipeId, userId, or rating');
    }
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const existingRating = await RatingRepository.getRatingByUserAndRecipe(recipeId, userId);

    if (existingRating) {
      await RatingRepository.updateRating(recipeId, userId, rating);
      return { message: 'Rating updated successfully', rating, recipeId, isNew: false };
    } else {
      await RatingRepository.addRating(recipeId, userId, rating);
      return { message: 'Rating added successfully', rating, recipeId, isNew: true };
    }
  }

  /* Get the average rating for a recipe */

  async getAverageRating(recipeId: number): Promise<number> {
    if (!recipeId) {
      throw new Error('Recipe ID is required');
    }
    return await RatingRepository.getAverageRating(recipeId);
  }

  /* Get a user's rating for a specific recipe */

  async getUserRating(recipeId: number, userId: number): Promise<number> {
    if (!recipeId || !userId) {
      throw new Error('Recipe ID and User ID are required');
    }
    const userRating = await RatingRepository.getRatingByUserAndRecipe(recipeId, userId);
    return userRating ? userRating.rating : 0;
  }

  /* Update an existing rating */

  async updateRating(ratingId: number, userId: number, rating: number): Promise<void> {
    const existingRating = await RatingRepository.getRatingByIdAndUser(ratingId, userId);
    if (!existingRating) {
      throw new Error('Rating not found or unauthorized');
    }
    await RatingRepository.updateRating(existingRating.recipe_id, userId, rating);
  }

  /* Delete a rating */

  async deleteRating(ratingId: number, userId: number): Promise<void> {
    const existingRating = await RatingRepository.getRatingByIdAndUser(ratingId, userId);
    if (!existingRating) {
      throw new Error('Rating not found or unauthorized');
    }
    await RatingRepository.deleteRating(ratingId);
  }
}

export default new RatingService();