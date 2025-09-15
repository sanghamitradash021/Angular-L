import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Request, Response } from 'express';
import commentController from '../controllers/commentController';
import commentService from '../service/commentService';

// Mock the commentService
vi.mock('../service/commentService', () => ({
  default: {
    addComment: vi.fn(),
    getComments: vi.fn(),
    deleteComment: vi.fn(),
  },
}));

describe('Comment Controller', () => {
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

  // Test for adding a comment
  describe('addComment', () => {
    it('should add a comment and return the new comment', async () => {
      const newComment = { comment_id: 1, content: 'Great recipe!', userId: 1 };
      req.params = { recipeId: '1' };
      req.body = { userId: 1, content: 'Great recipe!' };

      (commentService.addComment as Mock).mockResolvedValue(newComment);

      await commentController.addComment(req as Request, res as Response);

      expect(commentService.addComment).toHaveBeenCalledWith(1, 1, 'Great recipe!');
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(newComment);
    });
  });

  // Test for getting comments for a recipe
  describe('getComments', () => {
    it('should retrieve all comments for a given recipe', async () => {
      const comments = [{ content: 'Comment 1' }, { content: 'Comment 2' }];
      req.params = { recipeId: '1' };
      (commentService.getComments as Mock).mockResolvedValue(comments);

      await commentController.getComments(req as Request, res as Response);

      expect(commentService.getComments).toHaveBeenCalledWith(1);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(comments);
    });
  });

  // Test for deleting a comment
  describe('deleteComment', () => {
    it('should delete a comment if it exists and belongs to the user', async () => {
      req.body = { commentId: 1, userId: 1 };
      (commentService.deleteComment as Mock).mockResolvedValue(true);

      await commentController.deleteComment(req as Request, res as Response);

      expect(commentService.deleteComment).toHaveBeenCalledWith(1, 1);
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: 'Comment deleted successfully' });
    });

    it('should return 404 if comment not found or user is unauthorized', async () => {
      req.body = { commentId: 99, userId: 1 };
      const error = new Error('Comment not found or unauthorized');
      (commentService.deleteComment as Mock).mockRejectedValue(error);

      await commentController.deleteComment(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Comment not found or unauthorized' }));
    });
  });
});