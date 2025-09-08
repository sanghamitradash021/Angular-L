"use strict";
// import { Request, Response } from "express";
// import { sequelize } from "../config/database";
// import { QueryTypes } from "sequelize";
// import multer from 'multer';
// // import Recipe from "../models/recipe";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recipeRepository_1 = __importDefault(require("../repositories/recipeRepository"));
// Set up multer for file uploads
// const storage = multer.diskStorage({
//     destination: (_req, _file, cb) => cb(null, "uploads/"),
//     filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });
// const createRecipe = async (req: Request, res: Response): Promise<void> => {
//     try {
//         console.log('=== CREATE RECIPE REQUEST ===');
//         console.log('Request body:', req.body);
//         console.log('Request file:', req.file);
//         console.log('Headers:', req.headers);
//         // Create the recipe data object with all fields including image
//         const recipeData = {
//             title: req.body.title,
//             user_id: parseInt(req.body.user_id),
//             description: req.body.description,
//             ingredients: req.body.ingredients,
//             instructions: req.body.instructions,
//             preparationTime: parseInt(req.body.preparationTime),
//             difficulty: req.body.difficulty,
//             cuisine: req.body.cuisine,
//             mealType: req.body.mealType,
//             image: req.file ? req.file.filename : null // Add the image filename
//         };
//         // Process ingredients if it's a string (convert to array)
//         if (typeof recipeData.ingredients === 'string') {
//             recipeData.ingredients = recipeData.ingredients
//                 .split('\n')
//                 .map((ingredient: string) => ingredient.trim())
//                 .filter((ingredient: string) => ingredient.length > 0);
//         }
//         console.log('Processed recipe data:', recipeData);
//         const recipeId = await recipeRepository.createRecipe(recipeData);
//         if (!recipeId) {
//             res.status(500).json({ message: "Failed to create recipe" });
//             return;
//         }
//         res.status(201).json({ 
//             message: "Recipe created successfully", 
//             recipeId,
//             recipe: recipeData
//         });
//     } catch (error) {
//         console.error('Error creating recipe:', error);
//         res.status(500).json({ message: "Error creating recipe", error });
//     }
// };
const createRecipe = async (req, res) => {
    try {
        console.log('=== CREATE RECIPE REQUEST ===');
        console.log('Request body:', req.body);
        // No more file processing - image comes as Cloudinary URL
        const recipeData = {
            title: req.body.title,
            user_id: parseInt(req.body.user_id),
            description: req.body.description,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            preparationTime: parseInt(req.body.preparationTime),
            difficulty: req.body.difficulty,
            cuisine: req.body.cuisine,
            mealType: req.body.mealType,
            image: req.body.image || null // This is now a Cloudinary URL
        };
        // Process ingredients if it's a string
        if (typeof recipeData.ingredients === 'string') {
            recipeData.ingredients = recipeData.ingredients
                .split('\n')
                .map((ingredient) => ingredient.trim())
                .filter((ingredient) => ingredient.length > 0);
        }
        console.log('Processed recipe data:', recipeData);
        const recipeId = await recipeRepository_1.default.createRecipe(recipeData);
        if (!recipeId) {
            res.status(500).json({ message: "Failed to create recipe" });
            return;
        }
        res.status(201).json({
            message: "Recipe created successfully",
            recipeId,
            recipe: recipeData
        });
    }
    catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ message: "Error creating recipe", error });
    }
};
const getRecipeById = async (req, res) => {
    try {
        const recipe = await recipeRepository_1.default.findById(Number(req.params.id));
        if (!recipe) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        res.json(recipe);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching recipe", error });
    }
};
const searchRecipes = async (req, res) => {
    try {
        const recipes = await recipeRepository_1.default.searchRecipes(req.params.query);
        res.json(recipes);
    }
    catch (error) {
        res.status(500).json({ message: "Error searching recipes", error });
    }
};
const getAllRecipes = async (req, res) => {
    try {
        const { page = 1, limit = 100 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const recipes = await recipeRepository_1.default.getAllRecipes(Number(limit), offset);
        res.json(recipes);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching recipes", error });
    }
};
// const updateRecipe = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const updated = await recipeRepository.updateRecipe(Number(req.params.id), req.body);
//         if (!updated) {
//             res.status(404).json({ message: "Recipe not found or not updated" });
//             return;
//         }
//         res.json({ message: "Recipe updated successfully" });
//     } catch (error: any) {
//         console.error("Error updating recipe:", error); // Log the error for debugging
//         res.status(500).json({ message: "Error updating recipe", error: error.message || error });
//     }
// };
const updateRecipe = async (req, res) => {
    try {
        const recipeId = parseInt(req.params.id);
        const recipeData = {
            title: req.body.title,
            description: req.body.description,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            preparationTime: parseInt(req.body.preparationTime),
            difficulty: req.body.difficulty,
            cuisine: req.body.cuisine,
            mealType: req.body.mealType,
            image: req.body.image || null
        };
        // Process ingredients if it's a string
        if (typeof recipeData.ingredients === 'string') {
            recipeData.ingredients = recipeData.ingredients
                .split('\n')
                .map((ingredient) => ingredient.trim())
                .filter((ingredient) => ingredient.length > 0);
        }
        const updatedRecipe = await recipeRepository_1.default.updateRecipe(recipeId, recipeData);
        if (!updatedRecipe) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        res.status(200).json({
            message: "Recipe updated successfully",
            recipe: updatedRecipe
        });
    }
    catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ message: "Error updating recipe", error });
    }
};
// const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const deleted = await recipeRepository.deleteRecipe(Number(req.params.id));
//         if (!deleted) {
//             res.status(404).json({ message: "Recipe not found or already deleted" });
//             return;
//         }
//         res.json({ message: "Recipe deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting recipe", error });
//     }
// };
// In your recipeController.ts
const deleteRecipe = async (req, res) => {
    try {
        const recipeId = parseInt(req.params.id);
        console.log('Attempting to delete recipe with ID:', recipeId);
        // First check if recipe exists
        const existingRecipe = await recipeRepository_1.default.findById(recipeId);
        if (!existingRecipe) {
            console.log('Recipe not found - may have been already deleted');
            res.status(404).json({
                message: "Recipe not found - may have been already deleted",
                success: false,
                recipeId: recipeId
            });
            return;
        }
        const deleted = await recipeRepository_1.default.deleteRecipe(recipeId);
        if (deleted) {
            res.status(200).json({
                message: "Recipe deleted successfully",
                success: true,
                recipeId: recipeId
            });
        }
        else {
            res.status(500).json({
                message: "Failed to delete recipe",
                success: false
            });
        }
    }
    catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({
            message: "Error deleting recipe",
            error: error,
            success: false
        });
    }
};
const getRecipesByCuisine = async (req, res) => {
    try {
        const recipes = await recipeRepository_1.default.getRecipesByCuisine(req.params.cuisine);
        res.json(recipes);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching recipes", error });
    }
};
const getRecipesByMealType = async (req, res) => {
    try {
        const recipes = await recipeRepository_1.default.getRecipesByMealType(req.params.mealType);
        res.json(recipes);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching recipes", error });
    }
};
const getUserRecipes = async (req, res) => {
    try {
        const recipes = await recipeRepository_1.default.getUserRecipes(Number(req.params.userId));
        res.json(recipes);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching recipes", error });
    }
};
exports.default = { createRecipe, getRecipeById, searchRecipes, getAllRecipes, updateRecipe, deleteRecipe, getRecipesByCuisine, getRecipesByMealType, getUserRecipes };
