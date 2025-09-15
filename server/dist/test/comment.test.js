"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const commentController_1 = __importDefault(require("../controllers/commentController"));
const commentService_1 = __importDefault(require("../service/commentService"));
// Mock the commentService
vitest_1.vi.mock('../service/commentService', () => ({
    default: {
        addComment: vitest_1.vi.fn(),
        getComments: vitest_1.vi.fn(),
        deleteComment: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)('Comment Controller', () => {
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
    // Test for adding a comment
    (0, vitest_1.describe)('addComment', () => {
        (0, vitest_1.it)('should add a comment and return the new comment', async () => {
            const newComment = { comment_id: 1, content: 'Great recipe!', userId: 1 };
            req.params = { recipeId: '1' };
            req.body = { userId: 1, content: 'Great recipe!' };
            commentService_1.default.addComment.mockResolvedValue(newComment);
            await commentController_1.default.addComment(req, res);
            (0, vitest_1.expect)(commentService_1.default.addComment).toHaveBeenCalledWith(1, 1, 'Great recipe!');
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(201);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(newComment);
        });
    });
    // Test for getting comments for a recipe
    (0, vitest_1.describe)('getComments', () => {
        (0, vitest_1.it)('should retrieve all comments for a given recipe', async () => {
            const comments = [{ content: 'Comment 1' }, { content: 'Comment 2' }];
            req.params = { recipeId: '1' };
            commentService_1.default.getComments.mockResolvedValue(comments);
            await commentController_1.default.getComments(req, res);
            (0, vitest_1.expect)(commentService_1.default.getComments).toHaveBeenCalledWith(1);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(comments);
        });
    });
    // Test for deleting a comment
    (0, vitest_1.describe)('deleteComment', () => {
        (0, vitest_1.it)('should delete a comment if it exists and belongs to the user', async () => {
            req.body = { commentId: 1, userId: 1 };
            commentService_1.default.deleteComment.mockResolvedValue(true);
            await commentController_1.default.deleteComment(req, res);
            (0, vitest_1.expect)(commentService_1.default.deleteComment).toHaveBeenCalledWith(1, 1);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith({ message: 'Comment deleted successfully' });
        });
        (0, vitest_1.it)('should return 404 if comment not found or user is unauthorized', async () => {
            req.body = { commentId: 99, userId: 1 };
            const error = new Error('Comment not found or unauthorized');
            commentService_1.default.deleteComment.mockRejectedValue(error);
            await commentController_1.default.deleteComment(req, res);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(404);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: 'Comment not found or unauthorized' }));
        });
    });
});
