// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-home',
//   imports: [],
//   templateUrl: './home.html',
//   styleUrl: './home.css'
// })
// export class Home {

// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../service/recipe-service';
import { Recipe } from '../../models/interface/recipe.interface';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {
  allRecipes: Recipe[] = [];
  isScrollingPaused = false;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit() {
    this.recipeService.getAllRecipes().subscribe(recipes => {
      this.allRecipes = recipes;
    });
  }

  // Navigate to recipes filtered by meal type
  navigateToMealType(mealType: string) {
    // Navigate to a recipe list page with meal type filter
    // You might need to create a recipe-list component or modify existing one
    this.router.navigate(['/recipes'], {
      queryParams: { mealType: mealType.toLowerCase() }
    });
  }

  // Manual scroll controls
  scrollLeft() {
    const container = document.querySelector('.scrolling-container .flex') as HTMLElement;
    if (container) {
      container.scrollBy({ left: -320, behavior: 'smooth' }); // Scroll by one card width
    }
  }

  scrollRight() {
    const container = document.querySelector('.scrolling-container .flex') as HTMLElement;
    if (container) {
      container.scrollBy({ left: 320, behavior: 'smooth' }); // Scroll by one card width
    }
  }

  // Toggle auto-scroll pause
  toggleScroll() {
    this.isScrollingPaused = !this.isScrollingPaused;
    const scrollElement = document.querySelector('.animate-scroll') as HTMLElement;
    if (scrollElement) {
      scrollElement.style.animationPlayState = this.isScrollingPaused ? 'paused' : 'running';
    }
  }
}
