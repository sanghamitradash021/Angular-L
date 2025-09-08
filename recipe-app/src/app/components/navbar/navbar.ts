// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-navbar',
//   imports: [],
//   templateUrl: './navbar.html',
//   styleUrl: './navbar.css'
// })
// export class Navbar {

// }


// import { Component, computed } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../../service/auth-service';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//    templateUrl: './navbar.html',
//   styleUrls: ['./navbar.css']
// })
// export class NavbarComponent {
//   currentUser;
//   username;
//   isDropdownOpen = false;

//   constructor(private authService: AuthService, private router: Router) {
//     this.currentUser = this.authService.currentUser;
//     this.username = computed(() => this.currentUser()?.username);
//   }

//   toggleDropdown() {
//     this.isDropdownOpen = !this.isDropdownOpen;
//   }

//   logout() {
//     this.authService.logout();
//     this.isDropdownOpen = false;
//   }

//   navigateToMyRecipes() {
//     this.router.navigate(['/my-recipes']);
//     this.isDropdownOpen = false;
//   }
// }


// import { Component, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Router } from '@angular/router';
// import { FormsModule } from '@angular/forms'; // Add this import
// import { CreateRecipeModalComponent } from '../create-recipe-modal/create-recipe-modal';

// interface Recipe {
//   recipe_id: number;
//   title: string;
//   description: string;
//   image?: string;
//   cuisine: string;
//   preparationTime: number;
//   difficulty: string;
// }

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule, FormsModule, CreateRecipeModalComponent], // Add FormsModule
//   templateUrl: './navbar.html',
//   styleUrls: ['./navbar.css']
// })
// export class NavbarComponent {
//   private router = inject(Router);
  
//   // Existing properties
//   currentUser = signal(null); // Replace with your actual user service
//   username = signal('User'); // Replace with actual username
//   isDropdownOpen = false;
  
//   // Search properties
//   searchQuery = '';
//   showDropdown = false;
//   searchResults: Recipe[] = [];
//   private searchTimeout: any;

//   isCreateRecipeModalOpen = false;

//   // Mock data - replace with your actual recipe service
//   private allRecipes: Recipe[] = [
//     {
//       recipe_id: 1,
//       title: 'Classic Margherita Pizza',
//       description: 'A traditional Italian pizza with fresh tomatoes, mozzarella, and basil',
//       cuisine: 'Italian',
//       preparationTime: 25,
//       difficulty: 'Medium',
//       image: 'pizza.jpg'
//     },
//     {
//       recipe_id: 2,
//       title: 'Chicken Teriyaki Bowl',
//       description: 'Tender glazed chicken served over steamed rice with vegetables',
//       cuisine: 'Japanese',
//       preparationTime: 30,
//       difficulty: 'Easy',
//       image: 'teriyaki.jpg'
//     }
//     // Add more recipes as needed
//   ];

//   toggleDropdown() {
//     this.isDropdownOpen = !this.isDropdownOpen;
//   }

//   navigateToMyRecipes() {
//     this.router.navigate(['/my-recipes']);
//     this.isDropdownOpen = false;
//   }

//   logout() {
//     // Add your logout logic here
//     this.isDropdownOpen = false;
//   }

//    openCreateRecipeModal() {
//     this.isCreateRecipeModalOpen = true;
//     // Close user dropdown if it's open
//     this.isDropdownOpen = false;
//   }

//   closeCreateRecipeModal() {
//     this.isCreateRecipeModalOpen = false;
//   }

//   onRecipeCreated() {
//     // Handle successful recipe creation
//     console.log('Recipe created successfully!');
//     // You might want to:
//     // 1. Show a success message
//     // 2. Refresh the recipes list
//     // 3. Navigate to the new recipe
//     // 4. Update the search results
//     this.closeCreateRecipeModal();
//   }

//   // Search functionality
//   onSearchInput() {
//     // Clear previous timeout
//     if (this.searchTimeout) {
//       clearTimeout(this.searchTimeout);
//     }

//     // Debounce search for better performance
//     this.searchTimeout = setTimeout(() => {
//       this.performSearch();
//     }, 300);
//   }

//   performSearch() {
//     if (this.searchQuery.trim().length === 0) {
//       this.searchResults = [];
//       this.showDropdown = false;
//       return;
//     }

//     // Filter recipes based on search query
//     const query = this.searchQuery.toLowerCase();
//     this.searchResults = this.allRecipes.filter(recipe =>
//       recipe.title.toLowerCase().includes(query) ||
//       recipe.description.toLowerCase().includes(query) ||
//       recipe.cuisine.toLowerCase().includes(query)
//     ).slice(0, 5); // Limit to 5 results

//     this.showDropdown = this.searchResults.length > 0;
//   }

//   onSearchBlur() {
//     // Delay hiding dropdown to allow click events on results
//     setTimeout(() => {
//       this.showDropdown = false;
//     }, 200);
//   }

//   closeDropdown() {
//     this.showDropdown = false;
//     this.searchQuery = '';
//     this.searchResults = [];
//   }
// }

import { Component, inject, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreateRecipeModalComponent } from '../create-recipe-modal/create-recipe-modal';
import { AuthService } from '../../service/auth-service'; // Import your existing AuthService
import { RecipeEventsService } from '../../service/recipe-events.service';
import { RecipeService } from '../../service/recipe-service'; // Import RecipeService
import { Recipe } from '../../models/interface/recipe.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CreateRecipeModalComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService); // Inject your existing AuthService
  private recipeEventsService = inject(RecipeEventsService);
  private recipeService = inject(RecipeService); // Inject RecipeService
  
  // Use computed signals to reactively get auth state
  currentUser = computed(() => this.authService.currentUser());
  username = computed(() => {
    const user = this.authService.currentUser();
    return user ? (user.username || user.fullname || user.email || 'User') : '';
  });
  
  isDropdownOpen = false;
  
  // Search properties
  searchQuery = '';
  showDropdown = false;
  searchResults: Recipe[] = [];
  private searchTimeout: any;

  // Create Recipe Modal properties
  isCreateRecipeModalOpen = false;

  // Mobile menu properties
  isMobileMenuOpen = false;



  ngOnInit() {
    // No need for manual subscription since we're using computed signals
    // The navbar will automatically update when authService.currentUser() changes
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToMyRecipes() {
    this.router.navigate(['/my-recipes']);
    this.isDropdownOpen = false;
  }

  logout() {
    this.authService.logout(); // This will automatically update the signals
    this.isDropdownOpen = false;
  }

  // Create Recipe Modal methods
  openCreateRecipeModal() {
    this.isCreateRecipeModalOpen = true;
    this.isDropdownOpen = false;
  }

  closeCreateRecipeModal() {
    this.isCreateRecipeModalOpen = false;
  }

  onRecipeCreated(newRecipe: Recipe) {
    console.log('Recipe created successfully:', newRecipe);
    this.closeCreateRecipeModal();
    // Emit event to notify other components about the new recipe
    this.recipeEventsService.emitRecipeCreated(newRecipe);
  }

  // Search functionality
  onSearchInput() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300);
  }

  performSearch() {
    if (this.searchQuery.trim().length === 0) {
      this.searchResults = [];
      this.showDropdown = false;
      return;
    }

    // Use the actual recipe service to search
    this.recipeService.searchRecipes(this.searchQuery.trim()).subscribe({
      next: (results: Recipe[]) => {
        this.searchResults = results.slice(0, 5); // Limit to 5 results
        this.showDropdown = this.searchResults.length > 0;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.searchResults = [];
        this.showDropdown = false;
      }
    });
  }

  onSearchBlur() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  closeDropdown() {
    this.showDropdown = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  // Enhanced mobile menu close that also closes search dropdown
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    // Also close search dropdown when closing mobile menu
    this.showDropdown = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  // Mobile menu methods
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
