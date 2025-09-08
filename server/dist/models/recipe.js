"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const user_1 = __importDefault(require("./user"));
class Recipe extends sequelize_1.Model {
    recipe_id;
    user_id;
    title;
    description;
    ingredients;
    instructions;
    preparationTime;
    dfficulty;
    image;
    cuisine;
    mealType;
    createdAt;
    updatedAt;
}
Recipe.init({
    recipe_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
    },
    ingredients: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    instructions: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    preparationTime: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    difficulty: {
        type: sequelize_1.DataTypes.ENUM("Easy", "Medium", "Hard"),
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
    },
    cuisine: {
        type: sequelize_1.DataTypes.STRING,
    },
    mealType: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "Recipes",
    timestamps: true,
});
Recipe.belongsTo(user_1.default, { foreignKey: "user_id", onDelete: "CASCADE" });
user_1.default.hasMany(Recipe, { foreignKey: "user_id", onDelete: "CASCADE" });
exports.default = Recipe;
