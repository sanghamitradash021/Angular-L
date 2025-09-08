import { Sequelize } from "sequelize";
import dotenv from "dotenv"

dotenv.config()

export const sequelize = new Sequelize(

    process.env.DB_NAME || "recipe_sharing_platform",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "localhost",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false,
    },
)
