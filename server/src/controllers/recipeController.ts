import { Request, Response } from 'express';
import recipeService from '../service/recipeService';

/** Creates a new recipe.
 * @param req - The request object containing recipe details in body.
 * @param res - The response object.
 */

const createRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipeData = {
      ...req.body,
      user_id: parseInt(req.body.user_id),
      preparationTime: parseInt(req.body.preparationTime),
      image: req.body.image || null,
    };
    const result = await recipeService.createRecipe(recipeData);
    res.status(201).json({ message: 'Recipe created successfully', ...result });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating recipe', error });
  }
};

/** Retrieves a recipe by its ID.
 * @param req - The request object containing recipe ID in params.
 * @param res - The response object.
 */

const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipe = await recipeService.getRecipeById(Number(req.params.id));
    res.json(recipe);
  } catch (error: any) {
    const statusCode = error.message === 'Recipe not found' ? 404 : 500;
    res.status(statusCode).json({ message: error.message || 'Error fetching recipe', error });
  }
};
/** Searches for recipes based on a query string.   
 * @param req - The request object containing search query in params.
 * @param res - The response object.
 */

const searchRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipes = await recipeService.searchRecipes(req.params.query);
    res.json(recipes);
  } catch (error: any) {
    res.status(500).json({ message: 'Error searching recipes', error });
  }
};

/** Retrieves all recipes with pagination.
 * @param req - The request object containing page and limit in query.
 * @param res - The response object.
 */

const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const recipes = await recipeService.getAllRecipes(Number(page), Number(limit));
    res.json(recipes);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
};

/** Updates an existing recipe.
 * @param req - The request object containing recipe ID in params and updated details in body.
 * @param res - The response object.
 */

const updateRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipeId = parseInt(req.params.id);
    const recipeData = {
      ...req.body,
      preparationTime: parseInt(req.body.preparationTime),
    };
    const updatedRecipe = await recipeService.updateRecipe(recipeId, recipeData);
    res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error: any) {
    const statusCode = error.message === 'Recipe not found' ? 404 : 500;
    res.status(statusCode).json({ message: error.message || 'Error updating recipe', error });
  }
};

/** Deletes a recipe by its ID.
 * @param req - The request object containing recipe ID in params.
 * @param res - The response object.
 */

const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipeId = parseInt(req.params.id);
    const result = await recipeService.deleteRecipe(recipeId);
    res.status(200).json({ message: 'Recipe deleted successfully', ...result });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ message: error.message || 'Error deleting recipe', error, success: false });
  }
};

/** Retrieves recipes by cuisine type.
 * @param req - The request object containing cuisine type in params.
 * @param res - The response object.
 */

const getRecipesByCuisine = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipes = await recipeService.getRecipesByCuisine(req.params.cuisine);
    res.json(recipes);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
};

/** Retrieves recipes by meal type.
 * @param req - The request object containing meal type in params.
 * @param res - The response object.
 */

const getRecipesByMealType = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipes = await recipeService.getRecipesByMealType(req.params.mealType);
    res.json(recipes);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
};

/** Retrieves all recipes created by a specific user.
 * @param req - The request object containing userId in params.
 * @param res - The response object.
 */

const getUserRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipes = await recipeService.getUserRecipes(Number(req.params.userId));
    res.json(recipes);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
};

export default {
  createRecipe,
  getRecipeById,
  searchRecipes,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  getRecipesByCuisine,
  getRecipesByMealType,
  getUserRecipes,
};