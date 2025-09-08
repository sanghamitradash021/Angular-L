import { sequelize } from "../config/database";
import { QueryTypes } from "sequelize";
import bcrypt from "bcrypt";
import User from "../models/user";

class UserRepository {
    async create(userData: Partial<User>): Promise<User | null> {
        const { username, email, password, fullname, role } = userData;

        // Hash the password if it exists
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const result = await sequelize.query(
            `INSERT INTO Users (username, email, password, fullname, role, createdAt, updatedAt)
             VALUES (:username, :email, :password, :fullname, :role, NOW(), NOW())`,
            {
                replacements: {
                    username,
                    email,
                    password: hashedPassword,
                    fullname,
                    role,
                },
                type: QueryTypes.INSERT,
            }
        );

        // Retrieve the last inserted ID
        const [idResult] = await sequelize.query("SELECT LAST_INSERT_ID() as id", {
            type: QueryTypes.SELECT,
        });

        const user_id = (idResult as { id: number }).id;
        if (!user_id) return null;

        return this.findById(user_id);
    }

    async findById(id: number): Promise<User | null> {
        const [user]: any[] = await sequelize.query(
            "SELECT * FROM Users WHERE user_id = :id",
            {
                replacements: { id },
                type: QueryTypes.SELECT,
            }
        );

        return user ? (user as User) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const [user]: any[] = await sequelize.query(
            "SELECT * FROM Users WHERE email = :email",
            {
                replacements: { email },
                type: QueryTypes.SELECT,
            }
        );

        return user ? (user as User) : null;
    }

    async validateCredentials(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email);
        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid ? user : null;
    }

    async update(id: number, userData: Partial<User>): Promise<boolean> {
        const { username, email, password, fullname, role } = userData;

        let hashedPassword = undefined;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const result = await sequelize.query(
            `UPDATE Users SET username = :username, email = :email, 
             password = COALESCE(:password, password), fullname = :fullname, role = :role, updatedAt = NOW() 
             WHERE user_id = :id`,
            {
                replacements: { id, username, email, password: hashedPassword, fullname, role },
                type: QueryTypes.UPDATE,
            }
        );

        const affectedRows = Array.isArray(result) ? result[1] : 0;
        return affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const result = await sequelize.query(
            "DELETE FROM Users WHERE user_id = :id",
            { replacements: { id }, type: QueryTypes.DELETE }
        );

        const affectedRows = Array.isArray(result) ? result[1] : 0;
        return affectedRows > 0;
    }
}

export default new UserRepository();
