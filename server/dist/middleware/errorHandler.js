"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({
        message: "Something went wrong. Please try again later.",
        error: process.env.NODE_ENV === "design" ? err.message : undefined,
    });
};
exports.errorHandler = errorHandler;
