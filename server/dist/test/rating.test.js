"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const ratingController_1 = __importDefault(require("../controllers/ratingController"));
const ratingService_1 = __importDefault(require("../service/ratingService"));
// Mock the ratingService
vitest_1.vi.mock('../service/ratingService', () => ({
    default: {
        addOrUpdateRating: vitest_1.vi.fn(),
        getAverageRating: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)('Rating Controller', () => {
    let req;
    let res;
    let status;
    let json;
    (0, vitest_1.beforeEach)(() => {
        json = vitest_1.vi.fn();
        status = vitest_1.vi.fn(() => ({ json }));
        req = {
            body: {},
            params: {},
        };
        res = {
            status,
            json,
        };
        vitest_1.vi.clearAllMocks();
    });
    // Test for adding/updating a rating
    (0, vitest_1.describe)('addRating', () => {
        (0, vitest_1.it)('should add a new rating when one does not exist', async () => {
            req.body = { recipeId: 1, userId: 1, rating: 5 };
            const serviceResult = { message: 'Rating added successfully', rating: 5, recipeId: 1, isNew: true };
            ratingService_1.default.addOrUpdateRating.mockResolvedValue(serviceResult);
            await ratingController_1.default.addRating(req, res);
            (0, vitest_1.expect)(ratingService_1.default.addOrUpdateRating).toHaveBeenCalledWith(1, 1, 5);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(201);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(serviceResult);
        });
        (0, vitest_1.it)('should update an existing rating', async () => {
            req.body = { recipeId: 1, userId: 1, rating: 4 };
            const serviceResult = { message: 'Rating updated successfully', rating: 4, recipeId: 1, isNew: false };
            ratingService_1.default.addOrUpdateRating.mockResolvedValue(serviceResult);
            await ratingController_1.default.addRating(req, res);
            (0, vitest_1.expect)(ratingService_1.default.addOrUpdateRating).toHaveBeenCalledWith(1, 1, 4);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(serviceResult);
        });
        (0, vitest_1.it)('should return 400 for invalid rating value', async () => {
            req.body = { recipeId: 1, userId: 1, rating: 6 }; // Invalid rating
            const error = new Error('Rating must be between 1 and 5');
            ratingService_1.default.addOrUpdateRating.mockRejectedValue(error);
            await ratingController_1.default.addRating(req, res);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(400);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: 'Rating must be between 1 and 5' }));
        });
    });
    // Test for getting average rating
    (0, vitest_1.describe)('getRating', () => {
        (0, vitest_1.it)('should get the average rating for a recipe', async () => {
            req.params = { recipeId: '1' };
            ratingService_1.default.getAverageRating.mockResolvedValue(4.5);
            await ratingController_1.default.getRating(req, res);
            (0, vitest_1.expect)(ratingService_1.default.getAverageRating).toHaveBeenCalledWith(1);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith({ averageRating: 4.5 });
        });
        (0, vitest_1.it)('should return 0 if no ratings exist', async () => {
            req.params = { recipeId: '1' };
            ratingService_1.default.getAverageRating.mockResolvedValue(0);
            await ratingController_1.default.getRating(req, res);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith({ averageRating: 0 });
        });
    });
});
