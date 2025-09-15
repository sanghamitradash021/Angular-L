import recipeRepository from '../repositories/recipeRepository';
import Recipe from '../models/recipe';
import NodeCache from 'node-cache';

const recipeCache = new NodeCache({ stdTTL: 300 });

class RecipeService {

    /* Create a new recipe */

  async createRecipe(recipeData: any): Promise<{ recipeId: number; recipe: any }> {
    if (typeof recipeData.ingredients === 'string') {
      recipeData.ingredients = recipeData.ingredients
        .split('\n')
        .map((ingredient: string) => ingredient.trim())
        .filter((ingredient: string) => ingredient.length > 0);
    }

    const recipeId = await recipeRepository.createRecipe(recipeData);
    if (!recipeId) {
      throw new Error('Failed to create recipe');
    }
    return { recipeId, recipe: recipeData };
  }
/* Retrieve a recipe by its ID */
//   async getRecipeById(id: number): Promise<Recipe> {
//     const recipe = await recipeRepository.findById(id);
//     if (!recipe) {
//       throw new Error('Recipe not found');
//     }
//     return recipe;
//   }


async getRecipeById(id: number): Promise<Recipe> {
    // 1. Define a unique cache key for this recipe.
    const cacheKey = `recipe_${id}`;

    // 2. Try to get the recipe from the cache.
    const cachedRecipe = recipeCache.get<Recipe>(cacheKey);

    // 3. If the recipe is found in the cache, return it instantly.
    if (cachedRecipe) {
        console.log(`CACHE HIT: Found recipe ${id} in cache.`);
        return cachedRecipe;
    }

    // 4. If not in the cache, fetch it from the database.
    console.log(`CACHE MISS: Fetching recipe ${id} from database.`);
    const recipe = await recipeRepository.findById(id); 
    if (!recipe) {
        throw new Error('Recipe not found'); 
    }

    // 5. Store the newly fetched recipe in the cache before returning.
    recipeCache.set(cacheKey, recipe);

    return recipe; 
}

  /* Search for recipes based on a query string */

  async searchRecipes(query: string): Promise<Recipe[]> {
    return recipeRepository.searchRecipes(query);
  }

  /* Retrieve all recipes with pagination */

  async getAllRecipes(page: number, limit: number): Promise<Recipe[]> {
    const offset = (page - 1) * limit;
    return recipeRepository.getAllRecipes(limit, offset);
  }

  /* Update an existing recipe */

//   async updateRecipe(id: number, recipeData: any): Promise<Recipe> {
//     if (typeof recipeData.ingredients === 'string') {
//       recipeData.ingredients = recipeData.ingredients
//         .split('\n')
//         .map((ingredient: string) => ingredient.trim())
//         .filter((ingredient: string) => ingredient.length > 0);
//     }

//     const updatedRecipe = await recipeRepository.updateRecipe(id, recipeData);
//     if (!updatedRecipe) {
//       throw new Error('Recipe not found');
//     }
//     return updatedRecipe;
//   }

async updateRecipe(id: number, recipeData: any): Promise<Recipe> {
    if (typeof recipeData.ingredients === 'string') {
        recipeData.ingredients = recipeData.ingredients
            .split('\n')
            .map((ingredient: string) => ingredient.trim())
            .filter((ingredient: string) => ingredient.length > 0); 
    }

    const updatedRecipe = await recipeRepository.updateRecipe(id, recipeData); 
    if (!updatedRecipe) {
        throw new Error('Recipe not found'); 
    }

    // --- CACHE INVALIDATION ---
    const cacheKey = `recipe_${id}`;
    console.log(`INVALIDATE CACHE: Updating recipe ${id} in cache.`);
    // Set the cache with the new, updated recipe data.
    // This overwrites the old entry if it exists.
    recipeCache.set(cacheKey, updatedRecipe);
    // --- END CACHE INVALIDATION ---

    return updatedRecipe; 
}

  /* Delete a recipe by its ID */

//   async deleteRecipe(id: number): Promise<{ success: boolean; recipeId: number }> {
//     const existingRecipe = await recipeRepository.findById(id);
//     if (!existingRecipe) {
//       throw new Error('Recipe not found - may have been already deleted');
//     }

//     const deleted = await recipeRepository.deleteRecipe(id);
//     if (!deleted) {
//       throw new Error('Failed to delete recipe');
//     }
//     return { success: true, recipeId: id };
//   }

async deleteRecipe(id: number): Promise<{ success: boolean; recipeId: number }> {
    const existingRecipe = await recipeRepository.findById(id); 
    if (!existingRecipe) {
        throw new Error('Recipe not found - may have been already deleted'); 
    }

    const deleted = await recipeRepository.deleteRecipe(id);
    if (!deleted) {
        throw new Error('Failed to delete recipe');
    }

    // --- CACHE INVALIDATION ---
    const cacheKey = `recipe_${id}`;
    console.log(`INVALIDATE CACHE: Deleting recipe ${id} from cache.`);
    // Delete the entry from the cache.
    recipeCache.del(cacheKey);
    // --- END CACHE INVALIDATION ---

    return { success: true, recipeId: id }; 
}

  /* Get recipes by cuisine type */

  async getRecipesByCuisine(cuisine: string): Promise<Recipe[]> {
    return recipeRepository.getRecipesByCuisine(cuisine);
  }

  /* Get recipes by meal type */

  async getRecipesByMealType(mealType: string): Promise<Recipe[]> {
    return recipeRepository.getRecipesByMealType(mealType);
  }
  /* Get recipes created by a specific user */

  async getUserRecipes(userId: number): Promise<Recipe[]> {
    return recipeRepository.getUserRecipes(userId);
  }
}

export default new RecipeService();