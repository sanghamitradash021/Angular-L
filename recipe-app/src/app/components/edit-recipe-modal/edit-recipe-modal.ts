// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-edit-recipe-modal',
//   imports: [],
//   templateUrl: './edit-recipe-modal.html',
//   styleUrl: './edit-recipe-modal.css'
// })
// export class EditRecipeModal {

// }


// import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { RecipeService } from '../../service/recipe-service';
// import { Recipe } from '../../models/interface/recipe.interface';

// @Component({
//   selector: 'app-edit-recipe-modal',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './edit-recipe-modal.html',
// })
// export class EditRecipeModalComponent implements OnChanges {
//   @Input() recipe: Recipe | null = null;
//   @Output() close = new EventEmitter<void>();
//   @Output() success = new EventEmitter<Recipe>();

//   editForm: FormGroup;
//   error: string = '';
//   loading = false;

//   constructor(private fb: FormBuilder, private recipeService: RecipeService) {
//     this.editForm = this.fb.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       // ... other fields
//     });
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['recipe'] && this.recipe) {
//       this.editForm.patchValue(this.recipe);
//     }
//   }
  
//   onClose() {
//     this.close.emit();
//   }

//   onSubmit() {
//     // Similar submission logic as the create modal, but calling an update method
//   }
// }


import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecipeService } from '../../service/recipe-service';
import { AuthService } from '../../service/auth-service'; // Fix import path
import { Recipe } from '../../models/interface/recipe.interface';

@Component({
  selector: 'app-edit-recipe-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-recipe-modal.html',
})
export class EditRecipeModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() recipe: Recipe | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<Recipe>();

  editForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      ingredients: ['', Validators.required],
      instructions: ['', [Validators.required, Validators.minLength(10)]],
      preparationTime: ['', [Validators.required, Validators.min(1)]],
      difficulty: ['Medium', Validators.required],
      cuisine: ['', Validators.required],
      mealType: ['', Validators.required],
      image: ['']
    });
  }

  ngOnChanges() {
    if (this.recipe && this.isOpen) {
      // Parse ingredients if they're stored as JSON
      let ingredients: string = this.recipe.ingredients;
      if (typeof ingredients === 'string') {
        try {
          const parsed = JSON.parse(ingredients);
          if (Array.isArray(parsed)) {
            ingredients = (parsed as string[]).join('\n');
          }
          // If not array, keep as string
        } catch {
          // If parsing fails, keep as string
        }
      }
      // No need for else if since ingredients is always string from Recipe interface

      this.editForm.patchValue({
        title: this.recipe.title,
        description: this.recipe.description,
        ingredients: ingredients,
        instructions: this.recipe.instructions,
        preparationTime: this.recipe.preparationTime,
        difficulty: this.recipe.difficulty,
        cuisine: this.recipe.cuisine,
        mealType: this.recipe.mealType,
        image: this.recipe.image || ''
      });
    }
  }

  onClose() {
    this.close.emit();
    this.error = '';
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onSubmit() {
    if (this.editForm.invalid || !this.recipe) {
      Object.keys(this.editForm.controls).forEach(key => {
        this.editForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = { ...this.editForm.value };
    
    // Convert ingredients back to array format
    if (typeof formData.ingredients === 'string') {
      formData.ingredients = formData.ingredients
        .split('\n')
        .map((ingredient: string) => ingredient.trim())
        .filter((ingredient: string) => ingredient.length > 0);
    }

    this.recipeService.updateRecipe(this.recipe.recipe_id, formData).subscribe({
      next: (updatedRecipe) => {
        this.loading = false;
        this.success.emit(updatedRecipe);
        this.onClose();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to update recipe. Please try again.';
        console.error('Update error:', err);
      }
    });
  }
}