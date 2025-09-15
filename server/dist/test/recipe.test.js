"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const recipeController_1 = __importDefault(require("../controllers/recipeController"));
const recipeService_1 = __importDefault(require("../service/recipeService"));
// Provide a manual mock factory for the recipeService module.
vitest_1.vi.mock('../service/recipeService', () => ({
    default: {
        createRecipe: vitest_1.vi.fn(),
        getRecipeById: vitest_1.vi.fn(),
        getAllRecipes: vitest_1.vi.fn(),
        deleteRecipe: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)('Recipe Controller', () => {
    let req;
    let res;
    let status;
    let json;
    // Cast the imported service to its mocked version for type safety.
    const mockedRecipeService = recipeService_1.default;
    (0, vitest_1.beforeEach)(() => {
        json = vitest_1.vi.fn();
        status = vitest_1.vi.fn(() => ({ json }));
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
        vitest_1.vi.clearAllMocks();
    });
    // Test for creating a recipe
    (0, vitest_1.describe)('createRecipe', () => {
        (0, vitest_1.it)('should create a recipe and return success message with ID', async () => {
            const recipeData = { title: 'Test Pasta', user_id: '1', ingredients: 'Pasta, Sauce' };
            const serviceResult = { recipeId: 101, recipe: recipeData };
            req.body = recipeData;
            mockedRecipeService.createRecipe.mockResolvedValue(serviceResult);
            await recipeController_1.default.createRecipe(req, res);
            (0, vitest_1.expect)(mockedRecipeService.createRecipe).toHaveBeenCalled();
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(201);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                message: 'Recipe created successfully',
                recipeId: 101,
            }));
        });
        (0, vitest_1.it)('should return 500 if recipe creation fails', async () => {
            req.body = { title: 'Test Pasta' };
            const error = new Error('Failed to create recipe');
            mockedRecipeService.createRecipe.mockRejectedValue(error);
            await recipeController_1.default.createRecipe(req, res);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(500);
            // Use expect.objectContaining to ignore the extra 'error' property
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: 'Failed to create recipe' }));
        });
    });
    // Test for getting a recipe by ID
    (0, vitest_1.describe)('getRecipeById', () => {
        (0, vitest_1.it)('should return a recipe when found', async () => {
            const recipe = { recipe_id: 1, title: 'Test Recipe' };
            req.params = { id: '1' };
            mockedRecipeService.getRecipeById.mockResolvedValue(recipe);
            await recipeController_1.default.getRecipeById(req, res);
            (0, vitest_1.expect)(mockedRecipeService.getRecipeById).toHaveBeenCalledWith(1);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(recipe);
        });
        (0, vitest_1.it)('should return 404 when recipe is not found', async () => {
            req.params = { id: '99' };
            const error = new Error('Recipe not found');
            mockedRecipeService.getRecipeById.mockRejectedValue(error);
            await recipeController_1.default.getRecipeById(req, res);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(404);
            // Use expect.objectContaining to ignore the extra 'error' property
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: 'Recipe not found' }));
        });
    });
    // Test for getting all recipes
    (0, vitest_1.describe)('getAllRecipes', () => {
        (0, vitest_1.it)('should return a list of recipes', async () => {
            const recipes = [
                { id: 1, title: 'Recipe 1' },
                { id: 2, title: 'Recipe 2' },
            ];
            req.query = { page: '1', limit: '10' };
            mockedRecipeService.getAllRecipes.mockResolvedValue(recipes);
            await recipeController_1.default.getAllRecipes(req, res);
            (0, vitest_1.expect)(mockedRecipeService.getAllRecipes).toHaveBeenCalledWith(1, 10);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(recipes);
        });
    });
    // Test for deleting a recipe
    (0, vitest_1.describe)('deleteRecipe', () => {
        (0, vitest_1.it)('should delete a recipe and return success', async () => {
            req.params = { id: '1' };
            mockedRecipeService.deleteRecipe.mockResolvedValue({ success: true, recipeId: 1 });
            await recipeController_1.default.deleteRecipe(req, res);
            (0, vitest_1.expect)(mockedRecipeService.deleteRecipe).toHaveBeenCalledWith(1);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                message: 'Recipe deleted successfully',
                success: true,
            }));
        });
        (0, vitest_1.it)('should return 404 if recipe to delete is not found', async () => {
            req.params = { id: '99' };
            const error = new Error('Recipe not found - may have been already deleted');
            mockedRecipeService.deleteRecipe.mockRejectedValue(error);
            await recipeController_1.default.deleteRecipe(req, res);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(404);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                message: 'Recipe not found - may have been already deleted',
            }));
        });
    });
});
