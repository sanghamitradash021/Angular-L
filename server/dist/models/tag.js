"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Tag extends sequelize_1.Model {
    itag_id;
    name;
    createdAt;
}
Tag.init({
    tag_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "Tags",
    timestamps: true,
});
exports.default = Tag;
