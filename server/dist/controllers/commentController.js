"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commentService_1 = __importDefault(require("../service/commentService"));
/**
 * Adds a new comment to a recipe.
 * @param req - The request object containing userId, content in body and recipeId in params.
 * @param res - The response object.
 */
const addComment = async (req, res) => {
    try {
        const { userId, content } = req.body;
        const { recipeId } = req.params;
        const newComment = await commentService_1.default.addComment(Number(recipeId), userId, content);
        res.status(201).json(newComment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};
/**
 * Retrieves all comments for a specific recipe.
 * @param req - The request object containing recipeId in params.
 * @param res - The response object.
 */
const getComments = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const comments = await commentService_1.default.getComments(Number(recipeId));
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};
/**
 * Updates an existing comment.
 * @param req - The request object containing commentId, userId, content in body.
 * @param res - The response object.
 */
const updateComment = async (req, res) => {
    try {
        const { commentId, userId, content } = req.body;
        await commentService_1.default.updateComment(commentId, userId, content);
        res.status(200).json({ message: 'Comment updated successfully' });
    }
    catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ message: error.message || 'Error updating comment', error });
    }
};
/**
 * Deletes a comment.
 * @param req - The request object containing commentId, userId in body.
 * @param res - The response object.
 */
const deleteComment = async (req, res) => {
    try {
        const { commentId, userId } = req.body;
        await commentService_1.default.deleteComment(commentId, userId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ message: error.message || 'Error deleting comment', error });
    }
};
exports.default = {
    addComment,
    getComments,
    updateComment,
    deleteComment,
};
