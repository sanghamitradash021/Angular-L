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
  displayedRecipes: Recipe[] = [];
  showAll: boolean = false;
  loading: boolean = true;
  isScrollingPaused = false;

  constructor(private recipeService: RecipeService, private router: Router) { }

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService.getAllRecipes().subscribe(recipes => {
      this.allRecipes = recipes;
      this.displayedRecipes = this.allRecipes.slice(0, 6);
      this.loading = false;
    });
  }

  onViewAll() {
    this.displayedRecipes = this.allRecipes;
    this.showAll = true;
  }

  onGoToAllRecipes() {
    this.router.navigate(['/recipes']);
  }

  // Navigate to recipes filtered by meal type
  navigateToMealType(mealType: string) {
    this.router.navigate(['/recipes'], {
      queryParams: { mealType: mealType.toLowerCase() }
    });
  }

  // Manual scroll controls
  scrollLeft() {
    const container = document.querySelector('.scrolling-container') as HTMLElement;
    if (container) {
      // Scroll left by one card width smoothly without cloning nodes
      container.scrollBy({ left: -320, behavior: 'smooth' });
    }
  }

  scrollRight() {
    const container = document.querySelector('.scrolling-container') as HTMLElement;
    if (container) {
      // Scroll right by one card width smoothly without cloning nodes
      container.scrollBy({ left: 320, behavior: 'smooth' });
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

  showAllRecipes() {
    this.router.navigate(['/recipes']);
  }
}
