import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/database"
import Recipe from "./recipe"
import Tag from "./tag"

class RecipeTag extends Model {
    public recipetag_id!: number
    public tag_id!: number
}

RecipeTag.init(
    {
        recipetag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "RecipeTags",
        timestamps: false,
    }
)

RecipeTag.belongsTo(Recipe, { foreignKey: "recipe_id" })
RecipeTag.belongsTo(Tag, { foreignKey: "tag_id" })
Recipe.hasMany(RecipeTag, { foreignKey: "recipe_id" })
Tag.hasMany(RecipeTag, { foreignKey: "tag_id" })

export default RecipeTag
