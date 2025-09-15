import { Request, Response } from 'express';
import ratingService from '../service/ratingService';

/* addRating handles both adding a new rating and updating an existing one.
  */

const addRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipeId, userId, rating } = req.body;
    const result = await ratingService.addOrUpdateRating(recipeId, userId, rating);
    const statusCode = result.isNew ? 201 : 200;
    res.status(statusCode).json(result);
  } catch (error: any) {
    const statusCode = error.message.includes('required') || error.message.includes('must be') ? 400 : 500;
    res.status(statusCode).json({ message: error.message || 'Error adding/updating rating', error });
  }
};

/** Get the average rating for a recipe
 * @param req - The request object containing recipeId in params.
 * @param res - The response object.
 */

const getRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipeId } = req.params;
    const averageRating = await ratingService.getAverageRating(Number(recipeId));
    res.status(200).json({ averageRating: averageRating || 0 });
  } catch (error: any) {
    const statusCode = error.message.includes('required') ? 400 : 500;
    res.status(statusCode).json({ message: error.message || 'Error fetching rating', error });
  }
};

/** Get the rating given by a specific user for a specific recipe
 * @param req - The request object containing recipeId and userId in params.
 * @param res - The response object.
 */

const getUserRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipeId, userId } = req.params;
    const userRating = await ratingService.getUserRating(Number(recipeId), Number(userId));
    res.status(200).json({ userRating });
  } catch (error: any) {
    const statusCode = error.message.includes('required') ? 400 : 500;
    res.status(statusCode).json({ message: error.message || 'Error fetching user rating', error });
  }
};

/** Update an existing rating
 * @param req - The request object containing ratingId, userId, rating in body.
 * @param res - The response object.
 */ 

const updateRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ratingId, userId, rating } = req.body;
    await ratingService.updateRating(ratingId, userId, rating);
    res.status(200).json({ message: 'Rating updated successfully' });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ message: error.message || 'Error updating rating', error });
  }
};

/** Delete a rating
 * @param req - The request object containing ratingId, userId in body.
 * @param res - The response object.
 */

const deleteRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ratingId, userId } = req.body;
    await ratingService.deleteRating(ratingId, userId);
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ message: error.message || 'Error deleting rating', error });
  }
};

export default {
  addRating,
  getRating,
  getUserRating,
  updateRating,
  deleteRating,
};