// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class RecipeService {
  
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/interface/recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/api/recipes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('token') : null;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // createRecipe(recipeData: any): Observable<any> {
  //   const formData = new FormData();
    
  //   // Add all form fields to FormData
  //   formData.append('title', recipeData.title);
  //   formData.append('user_id', recipeData.user_id.toString());
  //   formData.append('description', recipeData.description);
  //   formData.append('ingredients', recipeData.ingredients);
  //   formData.append('instructions', recipeData.instructions);
  //   formData.append('preparationTime', recipeData.preparationTime.toString());
  //   formData.append('difficulty', recipeData.difficulty);
  //   formData.append('cuisine', recipeData.cuisine);
  //   formData.append('mealType', recipeData.mealType);
    
  //   // Add image if it exists
  //   if (recipeData.image) {
  //     console.log('Appending image to FormData:', recipeData.image);
  //     formData.append('image', recipeData.image);
  //   }
  //   console.log('FormData entries:');
  // for (let pair of formData.entries()) {
  //   console.log(pair[0] + ':', pair[1]);
  // }


  //   return this.http.post(`${this.apiUrl}/create`, formData, { 
  //     headers: this.getAuthHeaders() 
  //   });
  // }

    createRecipe(recipeData: any): Observable<any> {
    // When using Cloudinary, send JSON instead of FormData
    return this.http.post(`${this.apiUrl}/create`, recipeData, {
      headers: this.getAuthHeaders()
    });
  }

  updateRecipe(id: number, recipeData: any): Observable<Recipe> {
  return this.http.put<Recipe>(`${this.apiUrl}/${id}`, recipeData, {
    headers: this.getAuthHeaders()
  });
}

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/getall`);
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  getMyRecipes(userId: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/my-recipes/${userId}`, { headers: this.getAuthHeaders() });
  }
  
  searchRecipes(query: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/search/${query}`);
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  
  
  // Add other methods like create, update, comments, ratings as needed.
  
  // Comments methods
  getComments(recipeId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/comments/${recipeId}`);
  }

  addComment(recipeId: string, content: string, userId: number): Observable<any> {
    return this.http.post(`http://localhost:3000/api/comments/${recipeId}`,
      { content, userId },
      { headers: this.getAuthHeaders() }
    );
  }
  
  // Ratings methods
  addRating(recipeId: string, rating: number, userId: number): Observable<any> {
  return this.http.post('http://localhost:3000/api/ratings/rate', {
    recipeId: parseInt(recipeId),
    userId: userId,
    rating: rating
  }, {
    headers: this.getAuthHeaders()
  });
}

// Add method to get average rating
getAverageRating(recipeId: string): Observable<any> {
  return this.http.get(`http://localhost:3000/api/ratings/rate/${recipeId}`, {
    headers: this.getAuthHeaders()
  });
}

// Add method to get user's rating for a recipe
getUserRating(recipeId: string, userId: number): Observable<any> {
  return this.http.get(`http://localhost:3000/api/ratings/rate/user/${recipeId}/${userId}`, {
    headers: this.getAuthHeaders()
  });
}
}