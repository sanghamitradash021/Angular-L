"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const recipe_1 = __importDefault(require("./recipe"));
const tag_1 = __importDefault(require("./tag"));
class RecipeTag extends sequelize_1.Model {
    recipetag_id;
    tag_id;
}
RecipeTag.init({
    recipetag_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    tag_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "RecipeTags",
    timestamps: false,
});
RecipeTag.belongsTo(recipe_1.default, { foreignKey: "recipe_id" });
RecipeTag.belongsTo(tag_1.default, { foreignKey: "tag_id" });
recipe_1.default.hasMany(RecipeTag, { foreignKey: "recipe_id" });
tag_1.default.hasMany(RecipeTag, { foreignKey: "tag_id" });
exports.default = RecipeTag;
