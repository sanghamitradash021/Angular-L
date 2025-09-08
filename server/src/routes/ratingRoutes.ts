import express from 'express';
import ratingController from '../controllers/ratingController';

const router = express.Router();

/**
 * @swagger
 * /rate:
 *   post:
 *     summary: Add a rating for a recipe
 *     description: Add a rating for a specific recipe by a user. If the user has already rated the recipe, it will be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 description: Rating value (1-5)
 *     responses:
 *       201:
 *         description: Rating added successfully
 *       200:
 *         description: Rating updated successfully
 *       500:
 *         description: Error adding or updating rating
 */
router.post('/rate', ratingController.addRating);

/**
 * @swagger
 * /rate/{recipeId}:
 *   get:
 *     summary: Get the average rating for a recipe
 *     description: Retrieve the average rating of a specific recipe.
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         type: integer
 *         description: Recipe ID to get the average rating for
 *     responses:
 *       200:
 *         description: Average rating retrieved successfully
 *       500:
 *         description: Error fetching rating
 */
router.get('/rate/:recipeId', ratingController.getRating);

/**
 * @swagger
 * /rate/user/{recipeId}/{userId}:
 *   get:
 *     summary: Get the user's rating for a specific recipe
 *     description: Retrieve the rating given by a specific user for a specific recipe.
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         type: integer
 *         description: Recipe ID
 *       - in: path
 *         name: userId
 *         required: true
 *         type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User rating retrieved successfully
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Error fetching user rating
 */
router.get('/rate/user/:recipeId/:userId', ratingController.getUserRating);

/**
 * @swagger
 * /rate/user/{recipeId}/{userId}:
 *   get:
 *     summary: Get a user's rating for a specific recipe
 *     description: Retrieve the rating given by a specific user for a specific recipe.
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         type: integer
 *         description: Recipe ID
 *       - in: path
 *         name: userId
 *         required: true
 *         type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User rating retrieved successfully
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Error fetching rating
 */
router.get('/rate/user/:recipeId/:userId', ratingController.getUserRating);

/**
 * @swagger
 * /rate:
 *   put:
 *     summary: Update a rating for a recipe
 *     description: Update an existing rating for a specific recipe by a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ratingId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       404:
 *         description: Rating not found or unauthorized
 *       500:
 *         description: Error updating rating
 */
router.put('/rate', ratingController.updateRating);

/**
 * @swagger
 * /rate:
 *   delete:
 *     summary: Delete a rating for a recipe
 *     description: Delete a specific rating for a recipe based on the rating ID and user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ratingId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *       404:
 *         description: Rating not found or unauthorized
 *       500:
 *         description: Error deleting rating
 */
router.delete('/rate', ratingController.deleteRating);

export default router;
