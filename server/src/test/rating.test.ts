import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Request, Response } from 'express';
import ratingController from '../controllers/ratingController';
import ratingService from '../service/ratingService';

// Mock the ratingService
vi.mock('../service/ratingService', () => ({
  default: {
    addOrUpdateRating: vi.fn(),
    getAverageRating: vi.fn(),
  },
}));

describe('Rating Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let status: Mock;
  let json: Mock;

  beforeEach(() => {
    json = vi.fn();
    status = vi.fn(() => ({ json }));
    req = {
      body: {},
      params: {},
    };
    res = {
      status,
      json,
    };
    vi.clearAllMocks();
  });

  // Test for adding/updating a rating
  describe('addRating', () => {
    it('should add a new rating when one does not exist', async () => {
      req.body = { recipeId: 1, userId: 1, rating: 5 };
      const serviceResult = { message: 'Rating added successfully', rating: 5, recipeId: 1, isNew: true };
      (ratingService.addOrUpdateRating as Mock).mockResolvedValue(serviceResult);

      await ratingController.addRating(req as Request, res as Response);

      expect(ratingService.addOrUpdateRating).toHaveBeenCalledWith(1, 1, 5);
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(serviceResult);
    });

    it('should update an existing rating', async () => {
      req.body = { recipeId: 1, userId: 1, rating: 4 };
      const serviceResult = { message: 'Rating updated successfully', rating: 4, recipeId: 1, isNew: false };

      (ratingService.addOrUpdateRating as Mock).mockResolvedValue(serviceResult);

      await ratingController.addRating(req as Request, res as Response);

      expect(ratingService.addOrUpdateRating).toHaveBeenCalledWith(1, 1, 4);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(serviceResult);
    });

    it('should return 400 for invalid rating value', async () => {
      req.body = { recipeId: 1, userId: 1, rating: 6 }; // Invalid rating
      const error = new Error('Rating must be between 1 and 5');
      (ratingService.addOrUpdateRating as Mock).mockRejectedValue(error);

      await ratingController.addRating(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Rating must be between 1 and 5' }));
    });
  });

  // Test for getting average rating
  describe('getRating', () => {
    it('should get the average rating for a recipe', async () => {
      req.params = { recipeId: '1' };
      (ratingService.getAverageRating as Mock).mockResolvedValue(4.5);

      await ratingController.getRating(req as Request, res as Response);

      expect(ratingService.getAverageRating).toHaveBeenCalledWith(1);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ averageRating: 4.5 });
    });

    it('should return 0 if no ratings exist', async () => {
      req.params = { recipeId: '1' };
      (ratingService.getAverageRating as Mock).mockResolvedValue(0);

      await ratingController.getRating(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ averageRating: 0 });
    });
  });
});