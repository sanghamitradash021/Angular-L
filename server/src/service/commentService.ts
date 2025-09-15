import CommentRepository from '../repositories/commentRepository';

class CommentService {

    /* Add a new comment to a recipe */
  async addComment(recipeId: number, userId: number, content: string) {
    return await CommentRepository.addComment(recipeId, userId, content);
  }
/* Get all comments for a specific recipe */
  async getComments(recipeId: number) {
    return await CommentRepository.getCommentsByRecipe(recipeId);
  }
/* Update an existing comment */
  async updateComment(commentId: number, userId: number, content: string): Promise<void> {
    const existingComment = await CommentRepository.getCommentByIdAndUser(commentId, userId);
    if (!existingComment) {
      throw new Error('Comment not found or unauthorized');
    }
    await CommentRepository.updateComment(commentId, content);
  }
/* Delete a comment */
  async deleteComment(commentId: number, userId: number): Promise<void> {
    const existingComment = await CommentRepository.getCommentByIdAndUser(commentId, userId);
    if (!existingComment) {
      throw new Error('Comment not found or unauthorized');
    }
    await CommentRepository.deleteComment(commentId);
  }
}

export default new CommentService();