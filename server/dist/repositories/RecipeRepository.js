"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeRepository = void 0;
const sequelize_1 = require("sequelize");
const recipe_1 = __importDefault(require("../models/recipe"));
const BaseRepository_1 = require("./BaseRepository");
class RecipeRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(recipe_1.default);
    }
    async create(recipeData) {
        return await this.model.create(recipeData);
    }
    async findById(id) {
        return await this.model.findByPk(id);
    }
    async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const { count, rows } = await this.model.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
        return {
            recipes: rows,
            total: count
        };
    }
    async update(id, recipeData) {
        const recipe = await this.model.findByPk(id);
        if (!recipe)
            return null;
        return await recipe.update(recipeData);
    }
    async delete(id) {
        const deleted = await this.model.destroy({
            where: { recipe_id: id }
        });
        return deleted > 0;
    }
    async findByCuisine(cuisine) {
        return await this.model.findAll({
            where: { cuisine }
        });
    }
    async findByMealType(mealType) {
        return await this.model.findAll({
            where: { mealType }
        });
    }
    async findByUserId(userId) {
        return await this.model.findAll({
            where: { user_id: userId }
        });
    }
    async search(query) {
        return await this.model.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { title: { [sequelize_1.Op.like]: `%${query}%` } },
                    { description: { [sequelize_1.Op.like]: `%${query}%` } }
                ]
            }
        });
    }
    async getAllCuisines() {
        const recipes = await this.model.findAll({
            attributes: ['cuisine'],
            group: ['cuisine'],
            where: {
                cuisine: {
                    [sequelize_1.Op.ne]: null
                }
            }
        });
        return recipes.map(recipe => recipe.cuisine);
    }
    async getAllMealTypes() {
        const recipes = await this.model.findAll({
            attributes: ['mealType'],
            group: ['mealType'],
            where: {
                mealType: {
                    [sequelize_1.Op.ne]: null
                }
            }
        });
        return recipes.map(recipe => recipe.mealType);
    }
}
exports.RecipeRepository = RecipeRepository;
