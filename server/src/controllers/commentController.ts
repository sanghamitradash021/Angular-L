import { Request, Response } from 'express';
import commentService from '../service/commentService';

/**
 * Adds a new comment to a recipe.
 * @param req - The request object containing userId, content in body and recipeId in params.
 * @param res - The response object.
 */
const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, content } = req.body;
    const { recipeId } = req.params;
    const newComment = await commentService.addComment(Number(recipeId), userId, content);
    res.status(201).json(newComment);
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

/**
 * Retrieves all comments for a specific recipe.
 * @param req - The request object containing recipeId in params.
 * @param res - The response object.
 */
const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipeId } = req.params;
    const comments = await commentService.getComments(Number(recipeId));
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

/**
 * Updates an existing comment.
 * @param req - The request object containing commentId, userId, content in body.
 * @param res - The response object.
 */
const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { commentId, userId, content } = req.body;
    await commentService.updateComment(commentId, userId, content);
    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ message: error.message || 'Error updating comment', error });
  }
};

/**
 * Deletes a comment.
 * @param req - The request object containing commentId, userId in body.
 * @param res - The response object.
 */
const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { commentId, userId } = req.body;
    await commentService.deleteComment(commentId, userId);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ message: error.message || 'Error deleting comment', error });
  }
};

export default {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};