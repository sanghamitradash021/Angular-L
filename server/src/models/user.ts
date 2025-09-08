import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/database"

class User extends Model {
    public user_id!: number
    public username!: string
    public email!: string
    public password!: string
    public fullname!: string
    public role!: string

    public createdAt!: Date
    public updatedAt!: Date

}

User.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,

        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
        },

    },
    {
        sequelize,
        tableName: "Users",
        timestamps: true,
    }
)
export default User