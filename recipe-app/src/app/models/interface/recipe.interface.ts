export interface Comment {
  comment_id: number;
  recipe_id: number;
  user_id: number;
  content: string;
  username?: string; // Username of the user who made the comment (optional)
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  recipe_id: number;
  user_id: number;
  title: string;
  description: string;
  ingredients: string; // Or string[] depending on backend
  instructions: string;
  preparationTime: number;
  Comment: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  cuisine: string;
  mealType: string;
  createdAt: string;
  updatedAt: string;
  userRating?: number; // Optional property for user's rating
}
