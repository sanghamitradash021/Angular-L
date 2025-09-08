"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const user_1 = __importDefault(require("./user"));
const recipe_1 = __importDefault(require("./recipe"));
class Rating extends sequelize_1.Model {
    rate_id;
    user_id;
    recipe_id;
    rating;
    createdAt;
    updatedAt;
}
Rating.init({
    rate_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    recipe_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "Ratings",
    timestamps: true,
});
Rating.belongsTo(user_1.default, { foreignKey: "user_id", onDelete: "CASCADE" });
Rating.belongsTo(recipe_1.default, { foreignKey: "recipe_id", onDelete: "CASCADE" });
user_1.default.hasMany(Rating, { foreignKey: "user_id", onDelete: "CASCADE" });
recipe_1.default.hasMany(Rating, { foreignKey: "recipe_id", onDelete: "CASCADE" });
exports.default = Rating;
