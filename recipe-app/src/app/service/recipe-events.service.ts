import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from '../models/interface/recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeEventsService {
  private recipeCreatedSource = new Subject<Recipe>();
  private recipeUpdatedSource = new Subject<Recipe>();
  private recipeDeletedSource = new Subject<number>();

  recipeCreated$ = this.recipeCreatedSource.asObservable();
  recipeUpdated$ = this.recipeUpdatedSource.asObservable();
  recipeDeleted$ = this.recipeDeletedSource.asObservable();

  emitRecipeCreated(recipe: Recipe) {
    this.recipeCreatedSource.next(recipe);
  }

  emitRecipeUpdated(recipe: Recipe) {
    this.recipeUpdatedSource.next(recipe);
  }

  emitRecipeDeleted(recipeId: number) {
    this.recipeDeletedSource.next(recipeId);
  }
}
