import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/database"
import User from "./user"
import Recipe from "./recipe"

class Favorite extends Model {
    public fav_id!: number
    public user_id!: number
    public recipe_id!: number
    public createdAt!: Date
}

Favorite.init(
    {
        fav_id: {
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
    },
    {
        sequelize,
        tableName: "Favorites",
        timestamps: true,
    }
)

Favorite.belongsTo(User, { foreignKey: "user_id" })
Favorite.belongsTo(Recipe, { foreignKey: "recipe_id" })
User.hasMany(Favorite, { foreignKey: "user_id" })
Recipe.hasMany(Favorite, { foreignKey: "recipe_id" })

export default Favorite
