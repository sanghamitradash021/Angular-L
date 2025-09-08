import { Model, DataTypes } from "sequelize"
import { sequelize } from "../config/database"

class Tag extends Model {
    public itag_id!: string
    public name!: string
    public createdAt!: Date
}

Tag.init(
    {
        tag_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Tags",
        timestamps: true,
    }
)

export default Tag
