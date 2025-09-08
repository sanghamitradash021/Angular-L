// import { Request, Response } from "express";
// import { sequelize } from "../config/database";
// import { QueryTypes } from "sequelize";

// const addComment = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { userId, content } = req.body;
//         const { recipeId } = req.params;

//         const [newComment] = await sequelize.query(
//             `INSERT INTO Comments (recipe_id, user_id, content, createdAt, updatedAt) 
//                 VALUES (:recipeId, :userId, :content, NOW(), NOW())`,
//             {
//                 replacements: {
//                     recipeId,
//                     userId,
//                     content,
//                 },
//                 type: QueryTypes.INSERT,
//             }
//         );

//         res.status(201).json({ message: "Comment added successfully" });
//     } catch (error: any) {
//         // Log the detailed error for debugging
//         console.error("Error adding comment:", error);

//         res.status(500).json({ message: "Error adding comment", error: error.message });
//     }
// };



// const getComments = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { recipeId } = req.params;

//         const comments = await sequelize.query(
//             "SELECT * FROM Comments WHERE recipe_id = :recipeId",
//             {
//                 replacements: { recipeId },
//                 type: QueryTypes.SELECT,
//             }
//         );

//         res.status(200).json(comments);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching comments", error });
//     }
// };

// const updateComment = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { commentId, userId, content } = req.body;

//         // Check if the comment exists and belongs to the user
//         const [existingComment] = await sequelize.query(
//             "SELECT * FROM Comments WHERE comment_id = :commentId AND user_id = :userId",
//             {
//                 replacements: { commentId, userId },
//                 type: QueryTypes.SELECT,
//             }
//         );

//         if (!existingComment) {
//             res.status(404).json({ message: "Comment not found or unauthorized" });
//             return;
//         }

//         // Update comment content
//         await sequelize.query(
//             "UPDATE Comments SET content = :content, updatedAt = NOW() WHERE comment_id = :commentId",
//             {
//                 replacements: { content, commentId },
//                 type: QueryTypes.UPDATE,
//             }
//         );

//         res.status(200).json({ message: "Comment updated successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating comment", error });
//     }
// };

// const deleteComment = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { commentId, userId } = req.body;

//         // Check if the comment exists and belongs to the user
//         const [existingComment] = await sequelize.query(
//             "SELECT * FROM Comments WHERE comment_id = :commentId AND user_id = :userId",
//             {
//                 replacements: { commentId, userId },
//                 type: QueryTypes.SELECT,
//             }
//         );

//         if (!existingComment) {
//             res.status(404).json({ message: "Comment not found or unauthorized" });
//             return;
//         }

//         // Mark the comment as deleted
//         await sequelize.query(
//             "UPDATE Comments SET is_deleted = 1 WHERE comment_id = :commentId",
//             {
//                 replacements: { commentId },
//                 type: QueryTypes.UPDATE,
//             }
//         );

//         res.status(200).json({ message: "Comment deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting comment", error });
//     }
// };

// export default {
//     addComment,
//     getComments,
//     updateComment,
//     deleteComment,
// };


import { Request, Response } from "express";
import CommentRepository from "../repositories/commentRepository";

const addComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, content } = req.body;
        const { recipeId } = req.params;

        // Add the comment using the repository and get the new comment
        const newComment = await CommentRepository.addComment(Number(recipeId), userId, content);

        res.status(201).json(newComment);
    } catch (error: any) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};

const getComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { recipeId } = req.params;

        // Get the comments from the repository
        const comments = await CommentRepository.getCommentsByRecipe(Number(recipeId));

        res.status(200).json(comments);
    } catch (error: any) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
};

const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId, userId, content } = req.body;

        // Check if the comment exists and belongs to the user
        const existingComment = await CommentRepository.getCommentByIdAndUser(commentId, userId);

        if (!existingComment) {
            res.status(404).json({ message: "Comment not found or unauthorized" });
            return;
        }

        // Update the comment using the repository
        await CommentRepository.updateComment(commentId, content);

        res.status(200).json({ message: "Comment updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating comment", error });
    }
};

const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId, userId } = req.body;

        // Check if the comment exists and belongs to the user
        const existingComment = await CommentRepository.getCommentByIdAndUser(commentId, userId);

        if (!existingComment) {
            res.status(404).json({ message: "Comment not found or unauthorized" });
            return;
        }

        // Delete the comment using the repository
        await CommentRepository.deleteComment(commentId);

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error });
    }
};

export default {
    addComment,
    getComments,
    updateComment,
    deleteComment,
};
