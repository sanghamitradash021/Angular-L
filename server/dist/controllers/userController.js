"use strict";
// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { sequelize } from "../config/database";
// import { QueryTypes } from "sequelize";
// import User from "../models/user";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const register = async (req, res) => {
    try {
        const userExists = await userRepository_1.default.findByEmail(req.body.email);
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const userId = await userRepository_1.default.create(req.body);
        if (!userId) {
            res.status(500).json({ message: "Failed to create user" });
            return;
        }
        res.json({ message: "Profile created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error in registering", error });
    }
};
const login = async (req, res) => {
    try {
        const user = await userRepository_1.default.validateCredentials(req.body.email, req.body.password);
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.user_id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
        res.json({ user: { id: user.user_id, username: user.username, email: user.email, fullname: user.fullname }, token });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};
const getProfile = async (req, res) => {
    try {
        const user = await userRepository_1.default.findById(Number(req.params.id));
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching profile", error });
    }
};
const updateProfile = async (req, res) => {
    try {
        const success = await userRepository_1.default.update(Number(req.params.id), req.body);
        if (!success) {
            res.status(400).json({ message: "Failed to update profile" });
            return;
        }
        res.json({ message: "Profile updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
};
const deleteUser = async (req, res) => {
    try {
        const success = await userRepository_1.default.delete(Number(req.params.id));
        if (!success) {
            res.status(400).json({ message: "Failed to delete user" });
            return;
        }
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};
exports.default = { register, login, getProfile, updateProfile, deleteUser };
