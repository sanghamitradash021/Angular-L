"use strict";
// import { Request, Response } from "express";
// import { sequelize } from "../config/database";
// import { QueryTypes } from "sequelize";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ratingRepository_1 = __importDefault(require("../repositories/ratingRepository"));
const addRating = async (req, res) => {
    try {
        console.log('Rating request received:', req.body); // Debug log
        const { recipeId, userId, rating } = req.body;
        // Validate input
        if (!recipeId || !userId || !rating) {
            res.status(400).json({ message: "Missing required fields: recipeId, userId, or rating" });
            return;
        }
        if (rating < 1 || rating > 5) {
            res.status(400).json({ message: "Rating must be between 1 and 5" });
            return;
        }
        // Check if the user has already rated the recipe
        const existingRating = await ratingRepository_1.default.getRatingByUserAndRecipe(recipeId, userId);
        if (existingRating) {
            // Update existing rating
            await ratingRepository_1.default.updateRating(recipeId, userId, rating);
            console.log('Rating updated successfully');
            res.status(200).json({
                message: "Rating updated successfully",
                rating: rating,
                recipeId: recipeId
            });
        }
        else {
            // Add new rating
            await ratingRepository_1.default.addRating(recipeId, userId, rating);
            console.log('Rating added successfully');
            res.status(201).json({
                message: "Rating added successfully",
                rating: rating,
                recipeId: recipeId
            });
        }
    }
    catch (error) {
        console.error("❌ Error adding/updating rating:", error);
        res.status(500).json({ message: "Error adding/updating rating", error: error });
    }
};
const getRating = async (req, res) => {
    try {
        const { recipeId } = req.params;
        console.log('Getting rating for recipe:', recipeId);
        if (!recipeId) {
            res.status(400).json({ message: "Recipe ID is required" });
            return;
        }
        // Get average rating for the recipe
        const averageRating = await ratingRepository_1.default.getAverageRating(Number(recipeId));
        console.log('Average rating found:', averageRating);
        res.status(200).json({ averageRating: averageRating || 0 });
    }
    catch (error) {
        console.error("❌ Error in getRating:", error);
        res.status(500).json({ message: "Error fetching rating", error: error });
    }
};
const getUserRating = async (req, res) => {
    try {
        const { recipeId, userId } = req.params;
        console.log('Getting user rating for recipe:', recipeId, 'user:', userId);
        if (!recipeId || !userId) {
            res.status(400).json({ message: "Recipe ID and User ID are required" });
            return;
        }
        // Get user's rating for the recipe
        const userRating = await ratingRepository_1.default.getRatingByUserAndRecipe(Number(recipeId), Number(userId));
        if (userRating) {
            console.log('User rating found:', userRating.rating);
            res.status(200).json({ userRating: userRating.rating });
        }
        else {
            console.log('No rating found for user');
            res.status(200).json({ userRating: 0 });
        }
    }
    catch (error) {
        console.error("❌ Error in getUserRating:", error);
        res.status(500).json({ message: "Error fetching user rating", error: error });
    }
};
const updateRating = async (req, res) => {
    try {
        const { ratingId, userId, rating } = req.body;
        // Check if the rating exists and belongs to the user
        const existingRating = await ratingRepository_1.default.getRatingByIdAndUser(ratingId, userId);
        if (!existingRating) {
            res.status(404).json({ message: "Rating not found or unauthorized" });
            return;
        }
        // Update the rating
        await ratingRepository_1.default.updateRating(existingRating.recipe_id, userId, rating);
        res.status(200).json({ message: "Rating updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating rating", error });
    }
};
const deleteRating = async (req, res) => {
    try {
        const { ratingId, userId } = req.body;
        // Check if the rating exists and belongs to the user
        const existingRating = await ratingRepository_1.default.getRatingByIdAndUser(ratingId, userId);
        if (!existingRating) {
            res.status(404).json({ message: "Rating not found or unauthorized" });
            return;
        }
        // Delete the rating
        await ratingRepository_1.default.deleteRating(ratingId);
        res.status(200).json({ message: "Rating deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting rating", error });
    }
};
exports.default = {
    addRating,
    getRating,
    getUserRating,
    updateRating,
    deleteRating,
};
