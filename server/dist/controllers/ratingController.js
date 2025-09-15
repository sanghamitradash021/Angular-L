"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ratingService_1 = __importDefault(require("../service/ratingService"));
/* addRating handles both adding a new rating and updating an existing one.
  */
const addRating = async (req, res) => {
    try {
        const { recipeId, userId, rating } = req.body;
        const result = await ratingService_1.default.addOrUpdateRating(recipeId, userId, rating);
        const statusCode = result.isNew ? 201 : 200;
        res.status(statusCode).json(result);
    }
    catch (error) {
        const statusCode = error.message.includes('required') || error.message.includes('must be') ? 400 : 500;
        res.status(statusCode).json({ message: error.message || 'Error adding/updating rating', error });
    }
};
/** Get the average rating for a recipe
 * @param req - The request object containing recipeId in params.
 * @param res - The response object.
 */
const getRating = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const averageRating = await ratingService_1.default.getAverageRating(Number(recipeId));
        res.status(200).json({ averageRating: averageRating || 0 });
    }
    catch (error) {
        const statusCode = error.message.includes('required') ? 400 : 500;
        res.status(statusCode).json({ message: error.message || 'Error fetching rating', error });
    }
};
/** Get the rating given by a specific user for a specific recipe
 * @param req - The request object containing recipeId and userId in params.
 * @param res - The response object.
 */
const getUserRating = async (req, res) => {
    try {
        const { recipeId, userId } = req.params;
        const userRating = await ratingService_1.default.getUserRating(Number(recipeId), Number(userId));
        res.status(200).json({ userRating });
    }
    catch (error) {
        const statusCode = error.message.includes('required') ? 400 : 500;
        res.status(statusCode).json({ message: error.message || 'Error fetching user rating', error });
    }
};
/** Update an existing rating
 * @param req - The request object containing ratingId, userId, rating in body.
 * @param res - The response object.
 */
const updateRating = async (req, res) => {
    try {
        const { ratingId, userId, rating } = req.body;
        await ratingService_1.default.updateRating(ratingId, userId, rating);
        res.status(200).json({ message: 'Rating updated successfully' });
    }
    catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ message: error.message || 'Error updating rating', error });
    }
};
/** Delete a rating
 * @param req - The request object containing ratingId, userId in body.
 * @param res - The response object.
 */
const deleteRating = async (req, res) => {
    try {
        const { ratingId, userId } = req.body;
        await ratingService_1.default.deleteRating(ratingId, userId);
        res.status(200).json({ message: 'Rating deleted successfully' });
    }
    catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ message: error.message || 'Error deleting rating', error });
    }
};
exports.default = {
    addRating,
    getRating,
    getUserRating,
    updateRating,
    deleteRating,
};
