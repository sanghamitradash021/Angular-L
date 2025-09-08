"use strict";
// import { Request, Response } from "express";
// import { sequelize } from "../config/database";
// import { QueryTypes } from "sequelize";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commentRepository_1 = __importDefault(require("../repositories/commentRepository"));
const addComment = async (req, res) => {
    try {
        const { userId, content } = req.body;
        const { recipeId } = req.params;
        // Add the comment using the repository and get the new comment
        const newComment = await commentRepository_1.default.addComment(Number(recipeId), userId, content);
        res.status(201).json(newComment);
    }
    catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};
const getComments = async (req, res) => {
    try {
        const { recipeId } = req.params;
        // Get the comments from the repository
        const comments = await commentRepository_1.default.getCommentsByRecipe(Number(recipeId));
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
};
const updateComment = async (req, res) => {
    try {
        const { commentId, userId, content } = req.body;
        // Check if the comment exists and belongs to the user
        const existingComment = await commentRepository_1.default.getCommentByIdAndUser(commentId, userId);
        if (!existingComment) {
            res.status(404).json({ message: "Comment not found or unauthorized" });
            return;
        }
        // Update the comment using the repository
        await commentRepository_1.default.updateComment(commentId, content);
        res.status(200).json({ message: "Comment updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating comment", error });
    }
};
const deleteComment = async (req, res) => {
    try {
        const { commentId, userId } = req.body;
        // Check if the comment exists and belongs to the user
        const existingComment = await commentRepository_1.default.getCommentByIdAndUser(commentId, userId);
        if (!existingComment) {
            res.status(404).json({ message: "Comment not found or unauthorized" });
            return;
        }
        // Delete the comment using the repository
        await commentRepository_1.default.deleteComment(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting comment", error });
    }
};
exports.default = {
    addComment,
    getComments,
    updateComment,
    deleteComment,
};
