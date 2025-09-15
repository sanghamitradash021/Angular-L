import { describe, it, expect, vi, beforeEach,Mock,Mocked } from 'vitest';
import { Request, Response } from 'express';
import recipeController from '../controllers/recipeController';
import recipeService from '../service/recipeService';

// Provide a manual mock factory for the recipeService module.
vi.mock('../service/recipeService', () => ({
  default: {
    createRecipe: vi.fn(),
    getRecipeById: vi.fn(),
    getAllRecipes: vi.fn(),
    deleteRecipe: vi.fn(),
  },
}));

describe('Recipe Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let status: Mock;
  let json: Mock;

  // Cast the imported service to its mocked version for type safety.
  const mockedRecipeService = recipeService as Mocked<typeof recipeService>;

  beforeEach(() => {
    json = vi.fn();
    status = vi.fn(() => ({ json }));
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      status,
      json,
    };
    // Reset mocks before each test to ensure isolation
    vi.clearAllMocks();
  });

  // Test for creating a recipe
  describe('createRecipe', () => {
    it('should create a recipe and return success message with ID', async () => {
      const recipeData = { title: 'Test Pasta', user_id: '1', ingredients: 'Pasta, Sauce' };
      const serviceResult = { recipeId: 101, recipe: recipeData };
      req.body = recipeData;
      mockedRecipeService.createRecipe.mockResolvedValue(serviceResult);

      await recipeController.createRecipe(req as Request, res as Response);

      expect(mockedRecipeService.createRecipe).toHaveBeenCalled();
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Recipe created successfully',
          recipeId: 101,
        }),
      );
    });

    it('should return 500 if recipe creation fails', async () => {
      req.body = { title: 'Test Pasta' };
      const error = new Error('Failed to create recipe');
      mockedRecipeService.createRecipe.mockRejectedValue(error);

      await recipeController.createRecipe(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      // Use expect.objectContaining to ignore the extra 'error' property
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to create recipe' }));
    });
  });

  // Test for getting a recipe by ID
  describe('getRecipeById', () => {
    it('should return a recipe when found', async () => {
      const recipe = { recipe_id: 1, title: 'Test Recipe' };
      req.params = { id: '1' };
      mockedRecipeService.getRecipeById.mockResolvedValue(recipe as any);

      await recipeController.getRecipeById(req as Request, res as Response);

      expect(mockedRecipeService.getRecipeById).toHaveBeenCalledWith(1);
      expect(json).toHaveBeenCalledWith(recipe);
    });

    it('should return 404 when recipe is not found', async () => {
      req.params = { id: '99' };
      const error = new Error('Recipe not found');
      mockedRecipeService.getRecipeById.mockRejectedValue(error);

      await recipeController.getRecipeById(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      // Use expect.objectContaining to ignore the extra 'error' property
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Recipe not found' }));
    });
  });

  // Test for getting all recipes
  describe('getAllRecipes', () => {
    it('should return a list of recipes', async () => {
      const recipes = [
        { id: 1, title: 'Recipe 1' },
        { id: 2, title: 'Recipe 2' },
      ];
      req.query = { page: '1', limit: '10' };
      mockedRecipeService.getAllRecipes.mockResolvedValue(recipes as any);

      await recipeController.getAllRecipes(req as Request, res as Response);

      expect(mockedRecipeService.getAllRecipes).toHaveBeenCalledWith(1, 10);
      expect(json).toHaveBeenCalledWith(recipes);
    });
  });

  // Test for deleting a recipe
  describe('deleteRecipe', () => {
    it('should delete a recipe and return success', async () => {
      req.params = { id: '1' };
      mockedRecipeService.deleteRecipe.mockResolvedValue({ success: true, recipeId: 1 });

      await recipeController.deleteRecipe(req as Request, res as Response);

      expect(mockedRecipeService.deleteRecipe).toHaveBeenCalledWith(1);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Recipe deleted successfully',
          success: true,
        }),
      );
    });

    it('should return 404 if recipe to delete is not found', async () => {
      req.params = { id: '99' };
      const error = new Error('Recipe not found - may have been already deleted');
      mockedRecipeService.deleteRecipe.mockRejectedValue(error);

      await recipeController.deleteRecipe(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Recipe not found - may have been already deleted',
        }),
      );
    });
  });
});