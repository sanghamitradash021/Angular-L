import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';
import Recipe from '../models/recipe';

class RecipeRepository {
  async createRecipe(recipeData: any): Promise<number | null> {
    try {
      console.log('Repository received data:', recipeData);

      const {
        title,
        user_id,
        description,
        ingredients,
        instructions,
        preparationTime,
        difficulty,
        cuisine,
        mealType,
        image,
      } = recipeData;

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
        image: image || null, // This is the key fix
      };

      console.log('SQL Query:', query);
      console.log('Replacements:', replacements);

      await sequelize.query(query, {
        replacements,
        type: QueryTypes.INSERT,
      });

      const idResult: any = await sequelize.query('SELECT LAST_INSERT_ID() as id', { type: QueryTypes.SELECT });
      const newId = idResult?.[0]?.id ?? null;

      console.log('Created recipe with ID:', newId);
      return newId;
    } catch (error) {
      console.error('Error in createRecipe repository:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<any> {
    const recipe = await sequelize.query('SELECT * FROM Recipes WHERE recipe_id = :id', {
      replacements: { id },
      type: QueryTypes.SELECT,
    });

    return recipe.length > 0 ? recipe[0] : null;
  }

  async searchRecipes(query: string): Promise<any[]> {
    return await sequelize.query(
      `SELECT * FROM Recipes 
            WHERE title LIKE :query OR ingredients LIKE :query OR cuisine LIKE :query OR mealType LIKE :query`,
      {
        replacements: { query: `%${query}%` },
        type: QueryTypes.SELECT,
      },
    );
  }

  async getAllRecipes(limit: number, offset: number): Promise<any[]> {
    return await sequelize.query('SELECT * FROM Recipes LIMIT :limit OFFSET :offset', {
      replacements: { limit, offset },
      type: QueryTypes.SELECT,
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

  async updateRecipe(id: number, recipeData: any): Promise<Recipe | null> {
    const { title, description, ingredients, instructions, preparationTime, difficulty, cuisine, mealType, image } =
      recipeData;
    const ingredientsJson = JSON.stringify(ingredients);

    const result = await sequelize.query(
      `UPDATE Recipes 
         SET title = :title, description = :description, ingredients = :ingredients, 
             instructions = :instructions, preparationTime = :preparationTime, difficulty = :difficulty, 
             cuisine = :cuisine, mealType = :mealType, image = :image, updatedAt = NOW()
         WHERE recipe_id = :id`,
      {
        replacements: {
          id,
          title,
          description,
          ingredients: ingredientsJson,
          instructions,
          preparationTime,
          difficulty,
          cuisine,
          mealType,
          image,
        },
        type: QueryTypes.UPDATE,
      },
    );

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

  async deleteRecipe(id: number): Promise<boolean> {
    try {
      console.log('Repository: Deleting recipe with ID:', id);

      await sequelize.query('DELETE FROM Recipes WHERE recipe_id = :id', {
        replacements: { id },
        type: QueryTypes.DELETE,
      });

      // Since the query executed without error, assume deletion was successful
      // The controller already checks if the recipe exists before calling this method
      return true;
    } catch (error) {
      console.error('Repository error deleting recipe:', error);
      throw error;
    }
  }

  async getRecipesByCuisine(cuisine: string): Promise<any[]> {
    return await sequelize.query('SELECT * FROM Recipes WHERE cuisine = :cuisine', {
      replacements: { cuisine },
      type: QueryTypes.SELECT,
    });
  }

  async getRecipesByMealType(mealType: string): Promise<any[]> {
    return await sequelize.query('SELECT * FROM Recipes WHERE mealType = :mealType', {
      replacements: { mealType },
      type: QueryTypes.SELECT,
    });
  }

  async getUserRecipes(userId: number): Promise<any[]> {
    return await sequelize.query('SELECT * FROM Recipes WHERE user_id = :userId', {
      replacements: { userId },
      type: QueryTypes.SELECT,
    });
  }
}

export default new RecipeRepository();
