// import { Request, Response } from "express";
// import { sequelize } from "../config/database";
// import { QueryTypes } from "sequelize";
// import multer from 'multer';
// // import Recipe from "../models/recipe";

// /**
//  * Create a new recipe
//  */

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//     destination: (_req, _file, cb) => {
//         cb(null, 'uploads/'); // Folder where uploaded images will be saved
//     },
//     filename: (_req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Filename with timestamp to avoid conflicts
//     },
// });

// const upload = multer({ storage }); // Multer instance for handling image uploads

// // Add recipe with image upload functionality
// const createRecipe = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const {
//             title,
//             user_id,
//             description,
//             ingredients, // Array
//             instructions,
//             preparationTime,
//             difficulty,
//             cuisine,
//             mealType,
//             image,
//         } = req.body;

//         // Handle image upload
//         // const image = req.file ? req.file.filename : null; // Get image filename if uploaded

//         // Convert ingredients array to JSON string
//         const ingredientsJson = JSON.stringify(ingredients);

//         // Insert recipe into database
//         const [newRecipe] = await sequelize.query(
//             `INSERT INTO Recipes (title, user_id, description, ingredients, instructions, preparationTime, difficulty, cuisine, mealType, image, createdAt, updatedAt) 
//           VALUES (:title, :user_id, :description, :ingredients, :instructions, :preparationTime, :difficulty, :cuisine, :mealType, :image, NOW(), NOW())`,
//             {
//                 replacements: {
//                     title,
//                     user_id,
//                     description,
//                     ingredients: ingredientsJson,
//                     instructions,
//                     preparationTime,
//                     difficulty,
//                     cuisine,
//                     mealType,
//                     image, // Store image filename in the database
//                 },
//                 type: QueryTypes.INSERT,
//             }
//         );

//         // Retrieve the inserted recipe ID
//         const [idResult] = await sequelize.query("SELECT LAST_INSERT_ID() as id", { type: QueryTypes.SELECT });
//         const recipeId = (idResult as { id: number }).id;

//         if (!recipeId) {
//             res.status(500).json({ message: "Failed to create recipe" });
//             return;
//         }

//         res.status(201).json({ message: "Recipe created successfully", recipeId });
//     } catch (error) {
//         console.error("Error creating recipe:", error);
//         res.status(500).json({ message: "Error creating recipe", error });
//     }
// };

// export { createRecipe, upload };




// /**
//  * Retrieve a specific recipe by ID
//  */
// const getRecipeById = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { id } = req.params;

//         const [recipe] = await sequelize.query("SELECT * FROM Recipes WHERE recipe_id = :id", {
//             replacements: { id },
//             type: QueryTypes.SELECT,
//         });

//         if (!recipe) {
//             res.status(404).json({ message: "Recipe not found" });
//             return;
//         }

//         res.json(recipe);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching recipe", error });
//     }
// };

// /**
//  * Search recipes by title, ingredients, or tags
//  */
// const searchRecipes = async (req: Request, res: Response): Promise<void> => {
//     try {

//         const { query } = req.params;

//         const recipes = await sequelize.query(
//             `SELECT * FROM Recipes 
//              WHERE title LIKE :query OR ingredients LIKE :query OR cuisine LIKE :query OR mealType LIKE :query`,
//             {
//                 replacements: { query: `%${query}%` },
//                 type: QueryTypes.SELECT,
//             }
//         );

//         res.json(recipes);
//     } catch (error) {
//         console.log("error in fetching", error);
//         res.status(500).json({ message: "Error searching recipes", error });
//     }
// };

// /**
//  * Retrieve all recipes with pagination
//  */
// const getAllRecipes = async (req: Request, res: Response) => {
//     try {
//         console.log("hii");

//         // Get page and limit from query parameters, default to 1 and 10 if not provided
//         const { page = 1, limit = 100 } = req.query;

//         // Ensure page and limit are numbers
//         const offset = (Number(page) - 1) * Number(limit);

//         const recipes = await sequelize.query("SELECT * FROM Recipes LIMIT :limit OFFSET :offset", {
//             replacements: { limit: Number(limit), offset },
//             type: QueryTypes.SELECT,
//         });

//         // console.log("Raw Query Result:", recipes);
//         res.json(recipes);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching recipes", error });
//     }
// };


// /**
//  * Update a recipe (only creator can update)
//  */
// const updateRecipe = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { id } = req.params;
//         const { title, user_id, description, ingredients, instructions, preparationTime, difficulty, cuisine, mealType } = req.body;

//         // Check if recipe exists and get its user_id
//         const [recipe]: any = await sequelize.query(
//             "SELECT user_id FROM Recipes WHERE recipe_id = :id",
//             {
//                 replacements: { id },
//                 type: QueryTypes.SELECT,
//             }
//         );

//         if (!recipe) {
//             res.status(404).json({ message: "Recipe not found" });
//             return;
//         }


//         const ingredientsJSON = JSON.stringify(ingredients);
//         // Update the recipe
//         await sequelize.query(
//             `UPDATE Recipes 
//              SET title = :title, description = :description, ingredients = :ingredients, 
//                  instructions = :instructions, preparationTime = :preparationTime, difficulty = :difficulty, 
//                  cuisine = :cuisine, mealType = :mealType, updatedAt = NOW()
//              WHERE recipe_id = :id`,
//             {
//                 replacements: { id, title, description, ingredients: ingredientsJSON, instructions, preparationTime, difficulty, cuisine, mealType },
//                 type: QueryTypes.UPDATE,
//             }
//         );

//         res.json({ message: "Recipe updated successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating recipe", error });
//     }
// };


// /**
//  * Delete a recipe (only creator can delete)
//  */
// const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { id } = req.params;


//         // Delete the recipe
//         await sequelize.query("DELETE FROM Recipes WHERE recipe_id = :id", {
//             replacements: { id },
//             type: QueryTypes.DELETE,
//         });

//         res.json({ message: "Recipe deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting recipe", error });
//     }
// };

// /**
//  * Retrieve recipes filtered by cuisine type
//  */
// const getRecipesByCuisine = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { cuisine } = req.params;

//         const recipes = await sequelize.query("SELECT * FROM Recipes WHERE cuisine = :cuisine", {
//             replacements: { cuisine },
//             type: QueryTypes.SELECT,
//         });

//         res.json(recipes);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching recipes by cuisine", error });
//     }
// };

// /**
//  * Retrieve recipes filtered by meal type
//  */
// const getRecipesByMealType = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { mealType } = req.params;

//         const recipes = await sequelize.query("SELECT * FROM Recipes WHERE mealType = :mealType", {
//             replacements: { mealType },
//             type: QueryTypes.SELECT,
//         });

//         res.json(recipes);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching recipes by meal type", error });
//     }
// };

// /**
//  * Retrieve all available cuisine types
//  */
// const getAllCuisines = async (_req: Request, res: Response): Promise<void> => {
//     try {
//         const [cuisines] = await sequelize.query("SELECT DISTINCT cuisine FROM Recipes", { type: QueryTypes.SELECT });

//         res.json({ cuisines });
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching cuisines", error });
//     }
// };

// /**
//  * Retrieve all available meal types
//  */


// /**
//  * Retrieve all recipes created by a specific user (by user_id)
//  */
// const getUserRecipes = async (req: Request, res: Response): Promise<void> => {
//     try {
//         console.log("hii user")
//         const { userId } = req.params; // Get userId from query params
//         console.log(userId)

//         if (!userId) {
//             res.status(400).json({ message: 'User ID is required.' });
//             return;
//         }

//         const recipes = await sequelize.query(
//             "SELECT * FROM Recipes WHERE user_id = :userId",
//             {
//                 replacements: { userId },
//                 type: QueryTypes.SELECT,
//             }
//         );

//         if (recipes.length === 0) {
//             res.status(404).json({ message: 'No recipes found for this user.' });
//             return;
//         }

//         res.status(200).json(recipes);
//     } catch (error) {
//         console.error("Error fetching recipes by user:", error);
//         res.status(500).json({ message: "Error fetching recipes by user.", error });
//     }
// };




// const recipeController = {
//     createRecipe: createRecipe,
//     getRecipeById: getRecipeById,
//     searchRecipes: searchRecipes,
//     getAllRecipes: getAllRecipes,
//     updateRecipe: updateRecipe,
//     deleteRecipe: deleteRecipe,
//     getRecipesByCuisine: getRecipesByCuisine,
//     getRecipesByMealType: getRecipesByMealType,
//     getAllCuisines: getAllCuisines,
//     getUserRecipes: getUserRecipes,
// }
// export default recipeController;

import { Request, Response } from "express";
import recipeRepository from "../repositories/recipeRepository";
import multer from "multer";

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

const createRecipe = async (req: Request, res: Response): Promise<void> => {
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
                .map((ingredient: string) => ingredient.trim())
                .filter((ingredient: string) => ingredient.length > 0);
        }

        console.log('Processed recipe data:', recipeData);

        const recipeId = await recipeRepository.createRecipe(recipeData);
        
        if (!recipeId) {
            res.status(500).json({ message: "Failed to create recipe" });
            return;
        }

        res.status(201).json({ 
            message: "Recipe created successfully", 
            recipeId,
            recipe: recipeData
        });
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ message: "Error creating recipe", error });
    }
};



const getRecipeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const recipe = await recipeRepository.findById(Number(req.params.id));
        if (!recipe) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recipe", error });
    }
};

const searchRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
        const recipes = await recipeRepository.searchRecipes(req.params.query);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Error searching recipes", error });
    }
};

const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 100 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const recipes = await recipeRepository.getAllRecipes(Number(limit), offset);
        res.json(recipes);
    } catch (error) {
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


const updateRecipe = async (req: Request, res: Response): Promise<void> => {
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
                .map((ingredient: string) => ingredient.trim())
                .filter((ingredient: string) => ingredient.length > 0);
        }

        const updatedRecipe = await recipeRepository.updateRecipe(recipeId, recipeData);
        
        if (!updatedRecipe) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }

        res.status(200).json({ 
            message: "Recipe updated successfully", 
            recipe: updatedRecipe 
        });
    } catch (error) {
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
const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
    try {
        const recipeId = parseInt(req.params.id);
        
        console.log('Attempting to delete recipe with ID:', recipeId);
        
        // First check if recipe exists
        const existingRecipe = await recipeRepository.findById(recipeId);
        
        if (!existingRecipe) {
            console.log('Recipe not found - may have been already deleted');
            res.status(404).json({ 
                message: "Recipe not found - may have been already deleted",
                success: false,
                recipeId: recipeId
            });
            return;
        }
        
        const deleted = await recipeRepository.deleteRecipe(recipeId);
        
        if (deleted) {
            res.status(200).json({ 
                message: "Recipe deleted successfully",
                success: true,
                recipeId: recipeId
            });
        } else {
            res.status(500).json({ 
                message: "Failed to delete recipe",
                success: false 
            });
        }
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ 
            message: "Error deleting recipe", 
            error: error,
            success: false
        });
    }
};



const getRecipesByCuisine = async (req: Request, res: Response): Promise<void> => {
    try {
        const recipes = await recipeRepository.getRecipesByCuisine(req.params.cuisine);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recipes", error });
    }
};

const getRecipesByMealType = async (req: Request, res: Response): Promise<void> => {
    try {
        const recipes = await recipeRepository.getRecipesByMealType(req.params.mealType);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recipes", error });
    }
};

const getUserRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
        const recipes = await recipeRepository.getUserRecipes(Number(req.params.userId));
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recipes", error });
    }
};

export default { createRecipe, getRecipeById, searchRecipes, getAllRecipes, updateRecipe, deleteRecipe, getRecipesByCuisine, getRecipesByMealType, getUserRecipes };
