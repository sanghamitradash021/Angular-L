import { Component, EventEmitter, Input, Output, OnChanges, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecipeService } from '../../service/recipe-service';
import { Recipe } from '../../models/interface/recipe.interface';
import { RecipeEventsService } from '../../service/recipe-events.service'; // <-- 1. IMPORT the event service

@Component({
  selector: 'app-edit-recipe-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-recipe-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRecipeModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() recipe: Recipe | null = null;
  @Output() close = new EventEmitter<void>();
  // @Output() success = new EventEmitter<Recipe>(); // <-- 2. REMOVE the success output

  editForm: FormGroup;
  loading = false;
  error = '';

  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private recipeEventsService = inject(RecipeEventsService); // <-- 3. INJECT the event service

  constructor() {
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
      // ... (rest of the method is the same)
      let ingredients: string = this.recipe.ingredients;
      if (typeof ingredients === 'string') {
        try {
          const parsed = JSON.parse(ingredients);
          ingredients = Array.isArray(parsed) ? (parsed as string[]).join('\n') : ingredients;
        } catch {
          // It's already a plain string
        }
      }
      this.editForm.patchValue({ ...this.recipe, ingredients });
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
      // ... (rest of validation is the same)
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = { ...this.editForm.value };
    if (typeof formData.ingredients === 'string') {
      formData.ingredients = formData.ingredients.split('\n').map((i: string) => i.trim()).filter(Boolean);
    }

    this.recipeService.updateRecipe(this.recipe.recipe_id, formData).subscribe({
      next: (response) => {
        this.loading = false;
        // 4. EMIT the update through the service instead of the @Output
        this.recipeEventsService.emitRecipeUpdated(response.recipe);
        this.onClose();
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to update recipe. Please try again.';
      }
    });
  }
}