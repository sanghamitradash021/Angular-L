import Recipe from "./recipe";

import Tag from "./tag";
import User from "./user";
import Comment from "./comment";
import Rating from "./rating";
import Favorite from "./favorite";
import RecipeTag from "./recipetag";


const syncTables = async () => {
    try {
        await User.sync()
        console.log("User table synced successfully")

        await Tag.sync()
        console.log("Tag table synced successfully")

        await Recipe.sync({ alter: true })
        console.log("Recipe table synced successfully")

        await RecipeTag.sync()
        console.log("Recipe table synced successfully")

        await Comment.sync({ alter: true })
        console.log("Comment table synced successfully")

        await Rating.sync({ alter: true })
        console.log("Rating table synced successfully")

        await Favorite.sync()
        console.log("Favorite table synced successfully")
    } catch (error) {
        console.error("Error in syncing tables:", error)
    }
}

export default syncTables