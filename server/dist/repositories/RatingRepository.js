"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const rating_1 = __importDefault(require("../models/rating"));
class RatingRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(rating_1.default);
    }
    async findByRecipeId(recipeId) {
        return await this.model.findAll({
            where: { recipe_id: recipeId },
            order: [['createdAt', 'DESC']]
        });
    }
    async findByUserId(userId) {
        return await this.model.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']]
        });
    }
    async findByUserAndRecipe(userId, recipeId) {
        return await this.model.findOne({
            where: {
                user_id: userId,
                recipe_id: recipeId
            }
        });
    }
    async getAverageRatingForRecipe(recipeId) {
        const result = await this.model.findOne({
            where: { recipe_id: recipeId },
            attributes: [
                [this.model.sequelize.fn('AVG', this.model.sequelize.col('rating')), 'averageRating']
            ]
        });
        const avgRating = result?.getDataValue('averageRating');
        return avgRating ? Number(avgRating) : 0;
    }
}
exports.RatingRepository = RatingRepository;
