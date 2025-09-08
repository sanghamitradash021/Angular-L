"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recipe_1 = __importDefault(require("./recipe"));
const tag_1 = __importDefault(require("./tag"));
const user_1 = __importDefault(require("./user"));
const comment_1 = __importDefault(require("./comment"));
const rating_1 = __importDefault(require("./rating"));
const favorite_1 = __importDefault(require("./favorite"));
const recipetag_1 = __importDefault(require("./recipetag"));
const syncTables = async () => {
    try {
        await user_1.default.sync();
        console.log("User table synced successfully");
        await tag_1.default.sync();
        console.log("Tag table synced successfully");
        await recipe_1.default.sync({ alter: true });
        console.log("Recipe table synced successfully");
        await recipetag_1.default.sync();
        console.log("Recipe table synced successfully");
        await comment_1.default.sync({ alter: true });
        console.log("Comment table synced successfully");
        await rating_1.default.sync({ alter: true });
        console.log("Rating table synced successfully");
        await favorite_1.default.sync();
        console.log("Favorite table synced successfully");
    }
    catch (error) {
        console.error("Error in syncing tables:", error);
    }
};
exports.default = syncTables;
