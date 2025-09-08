"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const user_1 = __importDefault(require("./user"));
const recipe_1 = __importDefault(require("./recipe"));
class Comment extends sequelize_1.Model {
    comment_id;
    user_id;
    recipe_id;
    content;
    createdAt;
    updatedAt;
}
Comment.init({
    comment_id: {
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
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "Comments",
    timestamps: true,
});
Comment.belongsTo(user_1.default, { foreignKey: "user_id", onDelete: "CASCADE" });
Comment.belongsTo(recipe_1.default, { foreignKey: "recipe_id", onDelete: "CASCADE" });
user_1.default.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" });
recipe_1.default.hasMany(Comment, { foreignKey: "recipe_id", onDelete: "CASCADE" });
exports.default = Comment;
