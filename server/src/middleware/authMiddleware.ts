import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the structure of the decoded JWT payload
interface DecodedUser {
    id: number;
    email: string;
    iat: number;
    exp: number;
}

// Middleware to authenticate user via JWT
export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as DecodedUser;

        // Attach user info to the request object
        (req as any).user = decoded;

        // Proceed to the next middleware or route
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};
