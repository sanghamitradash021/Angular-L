// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-create-recipe-modal',
// //   imports: [],
// //   templateUrl: './create-recipe-modal.html',
// //   styleUrl: './create-recipe-modal.css'
// // })
// // export class CreateRecipeModal {

// // }


// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { RecipeService } from '../../service/recipe-service';
// import { AuthService } from '../../service/auth-service';

// @Component({
//   selector: 'app-create-recipe-modal',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './create-recipe-modal.html',
// })
// export class CreateRecipeModalComponent {
//   @Input() isOpen = false;
//   @Output() close = new EventEmitter<void>();
//   @Output() success = new EventEmitter<void>();

//   recipeForm: FormGroup;
//   error: string = '';
//   loading = false;

//   constructor(
//     private fb: FormBuilder,
//     private recipeService: RecipeService,
//     private authService: AuthService
//   ) {
//     this.recipeForm = this.fb.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       ingredients: ['', Validators.required],
//       instructions: ['', Validators.required],
//       preparationTime: ['', Validators.required],
//       difficulty: ['Medium', Validators.required],
//       cuisine: ['', Validators.required],
//       mealType: ['', Validators.required],
//       image: [null],
//     });
//   }

//   onClose() {
//     this.close.emit();
//   }

//     onBackdropClick(event: Event) {
//     // Close modal when clicking on backdrop (not the modal content)
//     if (event.target === event.currentTarget) {
//       this.onClose();
//     }
//   }

//   onImageChange(event: any) {
//   const file = event.target.files[0];
//   if (file) {
//     this.recipeForm.patchValue({
//       image: file
//     });
//   }
// }

//   onSubmit() {
//     if (this.recipeForm.invalid) {
//       return;
//     }
//     this.loading = true;
//     this.error = '';

//     const userId = this.authService.getUserId();
//     if (!userId) {
//       this.error = 'User not authenticated.';
//       this.loading = false;
//       return;
//     }

//     const formData = { ...this.recipeForm.value, user_id: userId };

    

//     // In a real app, you would handle file uploads properly,
//     // likely with a service that uploads to a backend or cloud storage.
//     // For this migration, we'll just pass the form data.
//     // this.recipeService.createRecipe(formData).subscribe({
//     //   next: () => {
//     //     this.loading = false;
//     //     this.success.emit();
//     //     this.onClose();
//     //   },
//     //   error: (err) => {
//     //     this.loading = false;
//     //     this.error = 'Failed to create recipe. Please try again.';
//     //   },
//     // });
//   }
// }


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RecipeService } from '../../service/recipe-service';
import { AuthService } from '../../service/auth-service';
import { CloudinaryService } from '../../service/cloudinary.service';
import { Recipe } from '../../models/interface/recipe.interface';

@Component({
  selector: 'app-create-recipe-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-recipe-modal.html',
})
export class CreateRecipeModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<Recipe>();

  recipeForm: FormGroup;
  error: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private authService: AuthService,
     private cloudinaryService: CloudinaryService
  ) {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      ingredients: ['', [Validators.required, Validators.minLength(5)]],
      instructions: ['', [Validators.required, Validators.minLength(10)]],
      preparationTime: ['', [Validators.required, Validators.min(1), Validators.max(480)]],
      difficulty: ['Medium', Validators.required],
      cuisine: ['', Validators.required],
      mealType: ['', Validators.required],
      image: [null], // This is optional
    });
  }

  // Add this method to check specific field errors
  getFieldError(fieldName: string): string {
    const field = this.recipeForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors?.['minlength']) {
        return `${fieldName} is too short`;
      }
      if (field.errors?.['min']) {
        return `${fieldName} must be at least 1`;
      }
    }
    return '';
  }

  // Add this method to see form status
  logFormStatus() {
    console.log('Form valid:', this.recipeForm.valid);
    console.log('Form errors:', this.recipeForm.errors);
    console.log('Form values:', this.recipeForm.value);
    
    // Check each field
    Object.keys(this.recipeForm.controls).forEach(key => {
      const field = this.recipeForm.get(key);
      if (field && field.invalid) {
        console.log(`${key} errors:`, field.errors);
      }
    });
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    console.log('Selected file:', file);
    if (file) {
      console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
      this.recipeForm.patchValue({
        image: file
      });
    }
    console.log('Form value after image:', this.recipeForm.get('image')?.value);
  }

  private resetForm() {
    this.recipeForm.reset({
      difficulty: 'Medium'
    });
    this.error = '';
    this.loading = false;
  }

  onSubmit() {
  // Debug: Check form status
  this.logFormStatus();

  if (this.recipeForm.invalid) {
    // Mark all fields as touched to show validation errors
    Object.keys(this.recipeForm.controls).forEach(key => {
      this.recipeForm.get(key)?.markAsTouched();
    });
    this.error = 'Please fill in all required fields correctly.';
    return;
  }

  this.loading = true;
  this.error = '';

  const userId = this.authService.getUserId();
  if (!userId) {
    this.error = 'User not authenticated.';
    this.loading = false;
    return;
  }

  const formData = { ...this.recipeForm.value, user_id: userId };

  if (formData.image && formData.image instanceof File) {
    console.log('Uploading image to Cloudinary...');
    this.cloudinaryService.uploadImage(formData.image).subscribe({
      next: (imageUrl) => {
        console.log('Image uploaded to Cloudinary:', imageUrl);
        formData.image = imageUrl; // Replace file with Cloudinary URL
        this.createRecipeWithData(formData);
      },
      error: (err) => {
        console.error('Cloudinary upload failed:', err);
        this.error = 'Failed to upload image. Please try again.';
        this.loading = false;
      }
    });
  } else {
    this.createRecipeWithData(formData);
  }
}

private createRecipeWithData(formData: any) {
  this.recipeService.createRecipe(formData).subscribe({
    next: (response) => {
      console.log('Recipe created successfully:', response);
      this.loading = false;
      // Emit the actual recipe object from the response
      if (response && response.recipe) {
        this.success.emit(response.recipe);
      } else {
        // If response doesn't have recipe property, create a basic recipe object
        const newRecipe: Recipe = {
          recipe_id: response.recipeId || 0,
          user_id: formData.user_id,
          title: formData.title,
          description: formData.description,
          ingredients: formData.ingredients,
          instructions: formData.instructions,
          preparationTime: formData.preparationTime,
          difficulty: formData.difficulty,
          cuisine: formData.cuisine,
          mealType: formData.mealType,
          image: formData.image || '/placeholder.svg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          Comment: ''
        };
        this.success.emit(newRecipe);
      }
      this.onClose();
    },
    error: (err) => {
      console.error('Recipe creation error:', err);
      this.loading = false;
      this.error = 'Failed to create recipe. Please try again.';
    },
  });
}
  // console.log('Submitting recipe:', formData);

  // Use the actual service call instead of setTimeout
  // this.recipeService.createRecipe(formData).subscribe({
  //   next: (response) => {
  //     console.log('Recipe created successfully:', response);
  //     this.loading = false;
  //     this.success.emit();
  //     this.onClose();
  //   },
  //   error: (err) => {
  //     console.error('Recipe creation error:', err);
  //     this.loading = false;
  //     this.error = 'Failed to create recipe. Please try again.';
  //   },
  // });
// }
}