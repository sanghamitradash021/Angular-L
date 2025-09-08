"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import bodyParser from "body-parser";
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const syncmodel_1 = __importDefault(require("./models/syncmodel"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const recipeRoutes_1 = __importDefault(require("./routes/recipeRoutes"));
const ratingRoutes_1 = __importDefault(require("./routes/ratingRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const swagger_1 = require("./swagger");
const errorHandler_1 = require("./middleware/errorHandler");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
// const bodyParser = require('body-parser');
(0, swagger_1.swaggerDocs)(app, PORT);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// app.use(bodyParser.json());
// Serve static files from the 'uploads' directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use("/api/USERS", userRoutes_1.default);
app.use("/api/recipes", recipeRoutes_1.default);
app.use("/api/ratings", ratingRoutes_1.default);
app.use("/api/comments", commentRoutes_1.default);
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        await database_1.sequelize.authenticate();
        console.log("Database connected successfully.");
        await (0, syncmodel_1.default)();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
startServer();
