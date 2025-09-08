"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const user_1 = __importDefault(require("./user"));
const recipe_1 = __importDefault(require("./recipe"));
class Favorite extends sequelize_1.Model {
    fav_id;
    user_id;
    recipe_id;
    createdAt;
}
Favorite.init({
    fav_id: {
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
}, {
    sequelize: database_1.sequelize,
    tableName: "Favorites",
    timestamps: true,
});
Favorite.belongsTo(user_1.default, { foreignKey: "user_id" });
Favorite.belongsTo(recipe_1.default, { foreignKey: "recipe_id" });
user_1.default.hasMany(Favorite, { foreignKey: "user_id" });
recipe_1.default.hasMany(Favorite, { foreignKey: "recipe_id" });
exports.default = Favorite;
