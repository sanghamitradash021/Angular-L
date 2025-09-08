import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/database"
import User from "./user"
import Recipe from "./recipe"

class Comment extends Model {
    public comment_id!: string
    public user_id!: string
    public recipe_id!: string
    public content!: string
    public createdAt!: Date
    public updatedAt!: Date
}

Comment.init(
    {
        comment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        recipe_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Comments",
        timestamps: true,
    }
)

Comment.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" })
Comment.belongsTo(Recipe, { foreignKey: "recipe_id", onDelete: "CASCADE" })
User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" })
Recipe.hasMany(Comment, { foreignKey: "recipe_id", onDelete: "CASCADE" })

export default Comment
