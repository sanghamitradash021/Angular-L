import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/database"
import User from "./user"

class Recipe extends Model {
    public recipe_id!: number
    public user_id!: string
    public title!: string
    public description!: string
    public ingredients!: object
    public instructions!: string
    public preparationTime!: number
    public dfficulty!: "Easy" | "Medium" | "Hard"
    public image!: string
    public cuisine!: string
    public mealType!: string
    public createdAt!: Date
    public updatedAt!: Date


}

Recipe.init(
    {
        recipe_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,

        },
        ingredients: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: false,

        },
        preparationTime: {
            type: DataTypes.INTEGER,
        },
        difficulty: {
            type: DataTypes.ENUM("Easy", "Medium", "Hard"),
        },
        image: {
            type: DataTypes.STRING,
        },
        cuisine: {
            type: DataTypes.STRING,
        },
        mealType: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        tableName: "Recipes",
        timestamps: true,
    }

)

Recipe.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" })
User.hasMany(Recipe, { foreignKey: "user_id", onDelete: "CASCADE" })

export default Recipe