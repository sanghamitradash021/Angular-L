"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
class RecipeRepository {
    async createRecipe(recipeData) {
        try {
            console.log('Repository received data:', recipeData);
            const { title, user_id, description, ingredients, instructions, preparationTime, difficulty, cuisine, mealType, image } = recipeData;
            const ingredientsJson = JSON.stringify(ingredients);
            const query = `INSERT INTO Recipes 
                (title, user_id, description, ingredients, instructions, preparationTime, difficulty, cuisine, mealType, image, createdAt, updatedAt) 
                VALUES (:title, :user_id, :description, :ingredients, :instructions, :preparationTime, :difficulty, :cuisine, :mealType, :image, NOW(), NOW())`;
            const replacements = {
                title,
                user_id,
                description,
                ingredients: ingredientsJson,
                instructions,
                preparationTime,
                difficulty,
                cuisine,
                mealType,
                image: image || null // This is the key fix
            };
            console.log('SQL Query:', query);
            console.log('Replacements:', replacements);
            await database_1.sequelize.query(query, {
                replacements,
                type: sequelize_1.QueryTypes.INSERT,
            });
            const idResult = await database_1.sequelize.query("SELECT LAST_INSERT_ID() as id", { type: sequelize_1.QueryTypes.SELECT });
            const newId = idResult?.[0]?.id ?? null;
            console.log('Created recipe with ID:', newId);
            return newId;
        }
        catch (error) {
            console.error("Error in createRecipe repository:", error);
            throw error;
        }
    }
    async findById(id) {
        const recipe = await database_1.sequelize.query("SELECT * FROM Recipes WHERE recipe_id = :id", {
            replacements: { id },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return recipe.length > 0 ? recipe[0] : null;
    }
    async searchRecipes(query) {
        return await database_1.sequelize.query(`SELECT * FROM Recipes 
            WHERE title LIKE :query OR ingredients LIKE :query OR cuisine LIKE :query OR mealType LIKE :query`, {
            replacements: { query: `%${query}%` },
            type: sequelize_1.QueryTypes.SELECT,
        });
    }
    async getAllRecipes(limit, offset) {
        return await database_1.sequelize.query("SELECT * FROM Recipes LIMIT :limit OFFSET :offset", {
            replacements: { limit, offset },
            type: sequelize_1.QueryTypes.SELECT,
        });
    }
    // async updateRecipe(id: number, recipeData: any): Promise<boolean> {
    //     const { title, description, ingredients, instructions, preparationTime, difficulty, cuisine, mealType } = recipeData;
    //     const ingredientsJson = JSON.stringify(ingredients);
    //     const result = await sequelize.query(
    //         `UPDATE Recipes 
    //          SET title = :title, description = :description, ingredients = :ingredients, 
    //              instructions = :instructions, preparationTime = :preparationTime, difficulty = :difficulty, 
    //              cuisine = :cuisine, mealType = :mealType, updatedAt = NOW()
    //          WHERE recipe_id = :id`,
    //         {
    //             replacements: { id, title, description, ingredients: ingredientsJson, instructions, preparationTime, difficulty, cuisine, mealType },
    //             type: QueryTypes.UPDATE,
    //         }
    //     );
    //     // Safely get the affectedRows from the result tuple
    //     const affectedRows = Array.isArray(result) && result[0] !== undefined ? result[0] : 0;
    //     return affectedRows > 0;
    // }
    // async updateRecipe(id: number, recipeData: any): Promise<boolean> {
    //     const { title, description, ingredients, instructions, preparationTime, difficulty, cuisine, mealType } = recipeData;
    //     const ingredientsJson = JSON.stringify(ingredients);
    //     const result = await sequelize.query(
    //         `UPDATE Recipes 
    //          SET title = :title, description = :description, ingredients = :ingredients, 
    //              instructions = :instructions, preparationTime = :preparationTime, difficulty = :difficulty, 
    //              cuisine = :cuisine, mealType = :mealType, updatedAt = NOW()
    //          WHERE recipe_id = :id`,
    //         {
    //             replacements: { id, title, description, ingredients: ingredientsJson, instructions, preparationTime, difficulty, cuisine, mealType },
    //             type: QueryTypes.UPDATE,
    //         }
    //     );
    //     console.log("Query result:", result); // Log the result for debugging
    //     const affectedRows = result && Array.isArray(result) && result[1] > 0 ? result[1] : 0; // Check if the affected rows is greater than 0
    //     return affectedRows > 0;
    // }
    async updateRecipe(id, recipeData) {
        const { title, description, ingredients, instructions, preparationTime, difficulty, cuisine, mealType, image } = recipeData;
        const ingredientsJson = JSON.stringify(ingredients);
        const result = await database_1.sequelize.query(`UPDATE Recipes 
         SET title = :title, description = :description, ingredients = :ingredients, 
             instructions = :instructions, preparationTime = :preparationTime, difficulty = :difficulty, 
             cuisine = :cuisine, mealType = :mealType, image = :image, updatedAt = NOW()
         WHERE recipe_id = :id`, {
            replacements: { id, title, description, ingredients: ingredientsJson, instructions, preparationTime, difficulty, cuisine, mealType, image },
            type: sequelize_1.QueryTypes.UPDATE,
        });
        // After updating, fetch and return the updated recipe
        const updatedRecipe = await this.findById(id);
        return updatedRecipe;
    }
    // async deleteRecipe(id: number): Promise<boolean> {
    //     const result = await sequelize.query("DELETE FROM Recipes WHERE recipe_id = :id", {
    //         replacements: { id },
    //         type: QueryTypes.DELETE,
    //     });
    //     const affectedRows = Array.isArray(result) ? result[0] : 0;
    //     return affectedRows > 0;
    // }
    async deleteRecipe(id) {
        try {
            console.log('Repository: Deleting recipe with ID:', id);
            await database_1.sequelize.query("DELETE FROM Recipes WHERE recipe_id = :id", {
                replacements: { id },
                type: sequelize_1.QueryTypes.DELETE,
            });
            // Since the query executed without error, assume deletion was successful
            // The controller already checks if the recipe exists before calling this method
            return true;
        }
        catch (error) {
            console.error('Repository error deleting recipe:', error);
            throw error;
        }
    }
    async getRecipesByCuisine(cuisine) {
        return await database_1.sequelize.query("SELECT * FROM Recipes WHERE cuisine = :cuisine", {
            replacements: { cuisine },
            type: sequelize_1.QueryTypes.SELECT,
        });
    }
    async getRecipesByMealType(mealType) {
        return await database_1.sequelize.query("SELECT * FROM Recipes WHERE mealType = :mealType", {
            replacements: { mealType },
            type: sequelize_1.QueryTypes.SELECT,
        });
    }
    async getUserRecipes(userId) {
        return await database_1.sequelize.query("SELECT * FROM Recipes WHERE user_id = :userId", {
            replacements: { userId },
            type: sequelize_1.QueryTypes.SELECT,
        });
    }
}
exports.default = new RecipeRepository();
