"use strict";
// import { Request, Response } from "express";
// import { sequelize } from "../config/db";
// import { QueryTypes } from "sequelize";
// const addFavorite = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { userId, recipeId } = req.body;
//         // Check if the recipe is already in favorites
//         const [existingFavorite] = await sequelize.query(
//             "SELECT * FROM Favorites WHERE user_id = :userId AND recipe_id = :recipeId",
//             {
//                 replacements: { userId, recipeId },
//                 type: QueryTypes.SELECT,
//             }
//         );
//         if (existingFavorite) {
//             res.status(400).json({ message: "Recipe already in favorites" });
//             return;
//         }
//         // Add recipe to favorites
//         await sequelize.query(
//             "INSERT INTO Favorites (user_id, recipe_id, created_at) VALUES (:userId, :recipeId, NOW())",
//             {
//                 replacements: { userId, recipeId },
//                 type: QueryTypes.INSERT,
//             }
//         );
//         res.status(201).json({ message: "Recipe added to favorites" });
//     } catch (error) {
//         res.status(500).json({ message: "Error adding to favorites", error });
//     }
// };
// const getFavorites = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { userId } = req.params;
//         const favorites = await sequelize.query(
//             "SELECT * FROM Recipes WHERE recipe_id IN (SELECT recipe_id FROM Favorites WHERE user_id = :userId)",
//             {
//                 replacements: { userId },
//                 type: QueryTypes.SELECT,
//             }
//         );
//         res.status(200).json(favorites);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching favorites", error });
//     }
// };
// const removeFavorite = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { userId, recipeId } = req.body;
// // Remove the
//     }
