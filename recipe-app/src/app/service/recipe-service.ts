// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class RecipeService {
  
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/interface/recipe.interface';
import { urlInterceptor } from '../interceptors/url.interceptor';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'recipes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('token') : null;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createRecipe(recipeData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, recipeData, {
      headers: this.getAuthHeaders()
    });
  }

  updateRecipe(id: number, recipeData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, recipeData, {
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

  // Comments methods
  getComments(recipeId: string): Observable<any[]> {
    return this.http.get<any[]>(`comments/${recipeId}`);
  }

  addComment(recipeId: string, content: string, userId: number): Observable<any> {
    return this.http.post(`comments/${recipeId}`,
      { content, userId },
      { headers: this.getAuthHeaders() }
    );
  }

  // Ratings methods
  addRating(recipeId: string, rating: number, userId: number): Observable<any> {
    return this.http.post('ratings/rate', {
      recipeId: parseInt(recipeId),
      userId: userId,
      rating: rating
    }, {
      headers: this.getAuthHeaders()
    });
  }

  // Add method to get average rating
  getAverageRating(recipeId: string): Observable<any> {
    return this.http.get(`ratings/rate/${recipeId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Add method to get user's rating for a recipe
  getUserRating(recipeId: string, userId: number): Observable<any> {
    return this.http.get(`ratings/rate/user/${recipeId}/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: urlInterceptor, multi: true }
];
