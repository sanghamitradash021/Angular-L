import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/database"
import User from "./user"
import Recipe from "./recipe"

class Rating extends Model {
    public rate_id!: number
    public user_id!: number
    public recipe_id!: number
    public rating!: number
    public createdAt!: Date
    public updatedAt!: Date
}

Rating.init(
    {
        rate_id: {
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
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
    },
    {
        sequelize,
        tableName: "Ratings",
        timestamps: true,
    }
)

Rating.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" })
Rating.belongsTo(Recipe, { foreignKey: "recipe_id", onDelete: "CASCADE" })
User.hasMany(Rating, { foreignKey: "user_id", onDelete: "CASCADE" })
Recipe.hasMany(Rating, { foreignKey: "recipe_id", onDelete: "CASCADE" })

export default Rating
