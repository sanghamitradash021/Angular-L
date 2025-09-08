// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { sequelize } from "../config/database";
// import { QueryTypes } from "sequelize";
// import User from "../models/user";

// const register = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { username, email, password, fullname, role } = req.body;

//         const [existinguser] = (await sequelize.query(
//             "SELECT * FROM Users WHERE email = :email",
//             {
//                 replacements: { email },
//                 type: QueryTypes.SELECT,
//             }
//         ));
//         if (existinguser) {
//             res.status(400).json({ message: "User already exists" });
//             return;
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const [newuser] = await sequelize.query(
//             `INSERT INTO Users (username,email,password,fullname, role, createdAt, updatedAt)
//         VALUES (:username, :email, :password, :fullname, :role, NOW(), NOW())`,
//             {
//                 replacements: {
//                     username,
//                     email,
//                     password: hashedPassword,
//                     fullname,
//                     role,
//                 },
//                 type: QueryTypes.INSERT,
//             }

//         );
//         const [idResult] = await sequelize.query("SELECT LAST_INSERT_ID() as id", {
//             type: QueryTypes.SELECT,
//         });

//         const user_id = (idResult as { id: number }).id;

//         if (!user_id) {
//             res.status(500).json({ message: "Failed to create user" });
//             return;
//         }
//         res.json({ message: "Profile created successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error in registering", error });
//     }


// };


// const login = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { email, password } = req.body;

//         const [user]: any[] = await sequelize.query(
//             "SELECT user_id, username, email, password AS password_hash, fullname FROM Users WHERE email = :email",
//             { replacements: { email }, type: QueryTypes.SELECT }
//         );

//         console.log("User fetched:", user); // Debugging

//         if (!user || !user.password_hash) {
//             res.status(400).json({ message: "Invalid credentials" });
//             return;
//         }

//         console.log("Stored hash:", user.password_hash);
//         console.log("Entered password:", password);

//         const isPasswordValid = await bcrypt.compare(password, user.password_hash);

//         if (!isPasswordValid) {
//             res.status(400).json({ message: "Invalid credentials" });
//             return;
//         }

//         const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET || "secret", {
//             expiresIn: "1d",
//         });

//         res.json({ user: { id: user.user_id, username: user.username, email: user.email, fullname: user.fullname }, token });
//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json({ message: "Error logging in", error });
//     }
// };


// const getProfile = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { id } = req.params;

//         const [user] = await sequelize.query(
//             "SELECT * FROM Users WHERE user_id = :id",
//             {
//                 replacements: { id },
//                 type: QueryTypes.SELECT,
//             }
//         );

//         if (!user) {
//             res.status(404).json({ message: "User not found" });
//             return;
//         }

//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching profile", error });
//     }
// };
// const updateProfilePatch = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { username, email, password, fullname, role } = req.body;
//         const { id } = req.params;

//         // Update only the provided fields
//         const [updatedUser] = await sequelize.query(
//             `UPDATE Users SET username = :username, email = :email, 
//              fullname = :fullname, role= :role, createdAt = Now(),updatedAt = NOW() WHERE user_id = :id`,
//             {
//                 replacements: { id, username, email, fullname, role },
//                 type: QueryTypes.UPDATE,
//             }
//         );



//         res.json({ message: "Profile updated successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating profile", error });
//     }
// };



// // Delete User (DELETE)
// const deleteUser = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { id } = req.params;

//         const deletedUser = await sequelize.query(
//             "DELETE FROM Users WHERE user_id = :id",
//             {
//                 replacements: { id },
//                 type: QueryTypes.DELETE,
//             }
//         );



//         res.json({ message: "User deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting user", error });
//     }
// };



// export default {
//     register,
//     login,
//     getProfile,
//     updateProfilePatch,
//     deleteUser,

// };


import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository";
import User from "../models/user";

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const userExists = await userRepository.findByEmail(req.body.email);
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const userId = await userRepository.create(req.body);
        if (!userId) {
            res.status(500).json({ message: "Failed to create user" });
            return;
        }

        res.json({ message: "Profile created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error in registering", error });
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userRepository.validateCredentials(req.body.email, req.body.password);
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });

        res.json({ user: { id: user.user_id, username: user.username, email: user.email, fullname: user.fullname }, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userRepository.findById(Number(req.params.id));
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error });
    }
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const success = await userRepository.update(Number(req.params.id), req.body);
        if (!success) {
            res.status(400).json({ message: "Failed to update profile" });
            return;
        }
        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const success = await userRepository.delete(Number(req.params.id));
        if (!success) {
            res.status(400).json({ message: "Failed to delete user" });
            return;
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};

export default { register, login, getProfile, updateProfile, deleteUser };
