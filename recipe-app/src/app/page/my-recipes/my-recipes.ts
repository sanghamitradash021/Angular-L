import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../service/recipe-service';
import { AuthService } from '../../service/auth-service';
import { RecipeEventsService } from '../../service/recipe-events.service';
import { Recipe } from '../../models/interface/recipe.interface';
import { RouterModule } from '@angular/router';
import { EditRecipeModalComponent } from '../../components/edit-recipe-modal/edit-recipe-modal';
import { DeleteConfirmationModalComponent } from '../../components/delete-confirmation-modal/delete-confirmation-modal';
import { Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule, EditRecipeModalComponent, DeleteConfirmationModalComponent, FormsModule],
  templateUrl: './my-recipes.html',
})
export class MyRecipesComponent implements OnInit, OnDestroy {
  myRecipes: Recipe[] = [];
  loading = true;
  error: string = '';

  selectedRecipe: Recipe | null = null;
  isEditModalOpen = false;

  isDeleteModalOpen = false;
  recipeToDelete: Recipe | null = null;
  isDeleting = false;

  sortBy: string = 'newest'; // Default sorting

  private subscriptions: Subscription = new Subscription();

  private recipeService = inject(RecipeService);
  private authService = inject(AuthService);
  private recipeEventsService = inject(RecipeEventsService);
  private logger = inject(NGXLogger);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadRecipes();
    this.subscribeToRecipeEvents();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeToRecipeEvents() {
    // This handles adding a brand new recipe to the list
    this.subscriptions.add(
      this.recipeEventsService.recipeCreated$.subscribe((newRecipe: Recipe) => {
        this.myRecipes.unshift(newRecipe); // Add to the beginning
        this.sortRecipes(); // Re-sort and trigger view update
      })
    );

    // This subscription now correctly handles the update from the modal or any other source
      this.subscriptions.add(
      this.recipeEventsService.recipeUpdated$.subscribe((updatedRecipe: Recipe) => {
        this.logger.debug('Recipe update event received:', updatedRecipe);
        const index = this.myRecipes.findIndex(r => r.recipe_id === updatedRecipe.recipe_id);
        if (index > -1) {
          this.myRecipes[index] = updatedRecipe;
          this.sortRecipes(); // Re-sort and trigger change detection
          this.cdr.detectChanges(); // Manually trigger change detection
        }
      })
    );

    // This handles removing a deleted recipe from the list
    this.subscriptions.add(
      this.recipeEventsService.recipeDeleted$.subscribe((recipeId: number) => {
        this.myRecipes = this.myRecipes.filter(r => r.recipe_id !== recipeId);
        // No need to re-sort here, filtering already creates a new array
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

  // Add a method to handle modal close event to trigger change detection
  onEditModalClose() {
    this.isEditModalOpen = false;
    this.cdr.detectChanges();
  }

  deleteRecipe(id: number) {
    this.recipeToDelete = this.myRecipes.find(r => r.recipe_id === id) || null;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (!this.recipeToDelete) return;
    this.isDeleting = true;
    this.recipeService.deleteRecipe(this.recipeToDelete.recipe_id).subscribe({
      next: () => {
        this.recipeEventsService.emitRecipeDeleted(this.recipeToDelete!.recipe_id);
        this.closeDeleteModal();
      },
      error: (err) => {
        this.logger.error('Delete failed:', err);
        // If the recipe was already deleted on the server, remove it from the UI
        if (err.status === 404) {
           this.recipeEventsService.emitRecipeDeleted(this.recipeToDelete!.recipe_id);
        }
        this.closeDeleteModal();
      }
    });
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.isDeleting = false;
    setTimeout(() => {
      this.recipeToDelete = null;
    }, 300); // Wait for modal animation
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
        const difficultyOrder: { [key: string]: number } = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        this.myRecipes.sort((a, b) => (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0));
        break;
    }
    // This is the most important line for change detection.
    // By creating a new array reference, you tell Angular that the list has changed.
    this.myRecipes = [...this.myRecipes];
  }
}