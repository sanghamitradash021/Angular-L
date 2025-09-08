// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-my-recipes',
//   imports: [],
//   templateUrl: './my-recipes.html',
//   styleUrl: './my-recipes.css'
// })
// export class MyRecipes {

// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../service/recipe-service';
import { AuthService } from '../../service/auth-service';
import { RecipeEventsService } from '../../service/recipe-events.service';
import { Recipe } from '../../models/interface/recipe.interface';
import { RouterModule } from '@angular/router';
import { EditRecipeModalComponent } from '../../components/edit-recipe-modal/edit-recipe-modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule, EditRecipeModalComponent, FormsModule],
  templateUrl: './my-recipes.html',
})
export class MyRecipesComponent implements OnInit, OnDestroy {
  myRecipes: Recipe[] = [];
  loading = true;
  error: string = '';

  selectedRecipe: Recipe | null = null;
  isEditModalOpen = false;

  sortBy: string = 'newest'; // Default sorting

  private subscriptions: Subscription = new Subscription();

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private recipeEventsService: RecipeEventsService
  ) {}

  ngOnInit() {
    this.loadRecipes();
    this.subscribeToRecipeEvents();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeToRecipeEvents() {
    // Subscribe to recipe created events
    this.subscriptions.add(
      this.recipeEventsService.recipeCreated$.subscribe((newRecipe: Recipe) => {
        this.onRecipeCreated(newRecipe);
      })
    );

    // Subscribe to recipe updated events
    this.subscriptions.add(
      this.recipeEventsService.recipeUpdated$.subscribe((updatedRecipe: Recipe) => {
        this.onRecipeUpdated(updatedRecipe);
      })
    );

    // Subscribe to recipe deleted events
    this.subscriptions.add(
      this.recipeEventsService.recipeDeleted$.subscribe((recipeId: number) => {
        this.myRecipes = this.myRecipes.filter(r => r.recipe_id !== recipeId);
      })
    );
  }

  loadRecipes() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.recipeService.getMyRecipes(userId).subscribe({
        next: (recipes) => {
          this.myRecipes = recipes;
          this.sortRecipes();
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to fetch your recipes.';
          this.loading = false;
        }
      });
    }
  }
  
  openEditModal(recipe: Recipe) {
    this.selectedRecipe = recipe;
    this.isEditModalOpen = true;
  }

  onRecipeUpdated(updatedRecipe: Recipe) {
    console.log('Recipe updated:', updatedRecipe); // Debug log

    const index = this.myRecipes.findIndex(r => r.recipe_id === updatedRecipe.recipe_id);
    if (index > -1) {
        // Update the recipe in the array with the new data
        this.myRecipes[index] = { ...updatedRecipe };

        // Trigger change detection by creating a new array reference
        this.myRecipes = [...this.myRecipes];

        console.log('Updated recipe in array:', this.myRecipes[index]); // Debug log
    }
    this.isEditModalOpen = false;
    this.selectedRecipe = null; // Clear selection
    // Emit event to notify other components
    this.recipeEventsService.emitRecipeUpdated(updatedRecipe);
  }

  onRecipeCreated(newRecipe: Recipe) {
    // If the new recipe has an image URL, ensure it is properly set
    if (!newRecipe.image) {
      newRecipe.image = '/placeholder.svg';
    }
    this.myRecipes = [newRecipe, ...this.myRecipes];
  }

  deleteRecipe(id: number) {
    if (confirm('Are you sure you want to delete this recipe?')) {
      // Don't use optimistic update - wait for server confirmation
      this.recipeService.deleteRecipe(id).subscribe({
        next: (response) => {
          console.log('Delete successful:', response);
          // Only remove from UI after successful server response
          this.myRecipes = this.myRecipes.filter(r => r.recipe_id !== id);
          // Emit event to notify other components
          this.recipeEventsService.emitRecipeDeleted(id);
        },
        error: (err) => {
          console.error('Delete failed:', err);

          // If 404 error, the recipe was already deleted - remove from UI
          if (err.status === 404) {
            console.log('Recipe already deleted, removing from UI');
            this.myRecipes = this.myRecipes.filter(r => r.recipe_id !== id);
            // Emit event even for 404 errors
            this.recipeEventsService.emitRecipeDeleted(id);
          } else {
            alert('Failed to delete recipe. Please try again.');
          }
        }
      });
    }
  }

  refreshRecipes() {
    this.loading = true;
    this.loadRecipes();
  }

  sortRecipes() {
    if (!this.myRecipes || this.myRecipes.length === 0) return;

    switch (this.sortBy) {
      case 'newest':
        this.myRecipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'cuisine':
        this.myRecipes.sort((a, b) => a.cuisine.localeCompare(b.cuisine));
        break;
      case 'title':
        this.myRecipes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'difficulty':
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        this.myRecipes.sort((a, b) => (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0));
        break;
      default:
        break;
    }
    // Trigger change detection by creating a new array reference
    this.myRecipes = [...this.myRecipes];
  }
}


