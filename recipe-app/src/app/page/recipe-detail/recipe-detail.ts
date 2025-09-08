// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-recipe-detail',
//   imports: [],
//   templateUrl: './recipe-detail.html',
//   styleUrl: './recipe-detail.css'
// })
// export class RecipeDetail {

// }

// import { Component, OnInit, computed } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { RecipeService } from '../../service/recipe-service';
// import { AuthService } from '../../service/auth-service';
// import { Recipe } from '../../models/interface/recipe.interface';
// import {} from '../../models/interface/recipe.interface';
// import { Comment } from '../../models/interface/recipe.interface';
// import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-recipe-detail',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './recipe-detail.html',
// })
// export class RecipeDetailComponent implements OnInit {
//   recipe: Recipe | null = null;
//   comments: Comment[] = [];
//   loading = true;
//   error: string = '';

//   currentUser;
//   isOwner;
  
//   commentForm: FormGroup;

//   constructor(
//     private route: ActivatedRoute,
//     private recipeService: RecipeService,
//     private authService: AuthService,
//     private fb: FormBuilder
//   ) {
//     this.currentUser = this.authService.currentUser;
//     this.isOwner = computed(() => this.currentUser()?.id === this.recipe?.user_id);
//     this.commentForm = this.fb.group({
//       content: ['']
//     });
//   }

//   ngOnInit() {
//     const recipeId = this.route.snapshot.paramMap.get('id');
//     if (recipeId) {
//       this.recipeService.getRecipeById(recipeId).subscribe({
//         next: (recipe) => {
//           this.recipe = recipe;
//           this.loading = false;
//           this.loadComments(recipeId);
//         },
//         error: () => {
//           this.error = 'Failed to load recipe.';
//           this.loading = false;
//         }
//       });
//     }
//   }

//   loadComments(recipeId: string) {
//     this.recipeService.getComments(recipeId).subscribe(comments => this.comments = comments);
//   }

//   addComment() {
//     const content = this.commentForm.value.content;
//     const userId = this.authService.getUserId();
//     const recipeId = this.recipe?.recipe_id.toString();

//     if (content && userId && recipeId) {
//       this.recipeService.addComment(recipeId, content, userId).subscribe(newComment => {
//         this.comments.push(newComment);
//         this.commentForm.reset();
//       });
//     }
//   }

//   addRating(rating: number) {
//     const userId = this.authService.getUserId();
//     const recipeId = this.recipe?.recipe_id.toString();
//     if (userId && recipeId) {
//       this.recipeService.addRating(recipeId, rating, userId).subscribe();
//     }
//   }
// }


import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../service/recipe-service';
import { AuthService } from '../../service/auth-service'; // Fix import path
import { Recipe, Comment } from '../../models/interface/recipe.interface'; // Fix imports
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-detail.html',
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  comments: Comment[] = [];
  loading = true;
  error: string = '';

  currentUser;
  isOwner;
  
  commentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.currentUser = this.authService.currentUser;
    this.isOwner = computed(() => this.currentUser()?.id === this.recipe?.user_id);
    this.commentForm = this.fb.group({
      content: ['']
    });
  }

  ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      this.recipeService.getRecipeById(recipeId).subscribe({
        next: (recipe) => {
          console.log('Recipe received:', recipe); // Debug log
          this.recipe = recipe;
          this.loading = false;
          this.loadComments(recipeId);
          this.loadUserRating(recipeId);
        },
        error: (err) => {
          console.error('Error loading recipe:', err); // Debug log
          this.error = 'Failed to load recipe.';
          this.loading = false;
        }
      });
    }
  }

  // Add method to get ingredients as array
  getIngredients(): string[] {
    if (!this.recipe?.ingredients) return [];
    
    try {
      // If ingredients is stored as JSON string, parse it
      if (typeof this.recipe.ingredients === 'string') {
        const parsed = JSON.parse(this.recipe.ingredients);
        return Array.isArray(parsed) ? parsed : [this.recipe.ingredients];
      }
      // If it's already an array
      if (Array.isArray(this.recipe.ingredients)) {
        return this.recipe.ingredients;
      }
      return [];
    } catch (error) {
      console.error('Error parsing ingredients:', error);
      return [];
    }
  }

  // Add method to get image URL
  getImageUrl(): string {
    if (!this.recipe?.image) return 'assets/placeholder.svg';
    
    // If it's already a full URL (Cloudinary), use it directly
    if (this.recipe.image.startsWith('http')) {
      return this.recipe.image;
    }
    
    // If it's a local filename, serve from backend uploads
    return `http://localhost:3000/uploads/${this.recipe.image}`;
  }

  loadComments(recipeId: string) {
    this.recipeService.getComments(recipeId).subscribe({
      next: (comments) => this.comments = comments,
      error: (err) => console.error('Error loading comments:', err)
    });
  }

  addComment() {
    const content = this.commentForm.value.content;
    const userId = this.authService.getUserId();
    const recipeId = this.recipe?.recipe_id.toString();

    if (content && userId && recipeId) {
      this.recipeService.addComment(recipeId, content, userId).subscribe({
        next: (newComment) => {
          this.comments.unshift(newComment); // Add to beginning so it appears at top
          this.commentForm.reset();
        },
        error: (err) => console.error('Error adding comment:', err)
      });
    }
  }

 addRating(rating: number) {
  const userId = this.authService.getUserId();
  const recipeId = this.recipe?.recipe_id.toString();

  console.log('Adding rating:', { recipeId, userId, rating }); // Debug log

  if (userId && recipeId) {
    this.recipeService.addRating(recipeId, rating, userId).subscribe({
      next: (response) => {
        console.log('Rating added successfully:', response);
        // Update the recipe's userRating to reflect the change in UI
        if (this.recipe) {
          this.recipe.userRating = rating;
        }
        // Optionally refresh the average rating
        this.loadAverageRating();
      },
      error: (err) => {
        console.error('Error adding rating:', err);
        alert('Failed to add rating. Please try again.');
      }
    });
  } else {
    alert('Please log in to rate this recipe.');
  }
}

// Add method to load average rating
loadAverageRating() {
  if (this.recipe) {
    this.recipeService.getAverageRating(this.recipe.recipe_id.toString()).subscribe({
      next: (response) => {
        console.log('Average rating:', response.averageRating);
        // Update UI with average rating
      },
      error: (err) => {
        console.error('Error loading average rating:', err);
      }
    });
  }
}

// Add method to load user's rating
loadUserRating(recipeId: string) {
  const userId = this.authService.getUserId();
  if (userId) {
    this.recipeService.getUserRating(recipeId, userId).subscribe({
      next: (response) => {
        console.log('User rating loaded:', response.userRating);
        if (this.recipe) {
          this.recipe.userRating = response.userRating;
        }
      },
      error: (err) => {
        console.error('Error loading user rating:', err);
      }
    });
  }
}
}
