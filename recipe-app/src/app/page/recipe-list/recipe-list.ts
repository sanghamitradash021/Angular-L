// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-recipe-list',
//   imports: [],
//   templateUrl: './recipe-list.html',
//   styleUrl: './recipe-list.css'
// })
// export class RecipeList {

// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../service/recipe-service';
import { Recipe } from '../../models/interface/recipe.interface';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-list.html',
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  loading = true;
  mealType: string | null = null;
  cuisine: string | null = null;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute) { }

  ngOnInit() {

    // 1. Fetch all recipes ONCE when the component initializes.
    this.loadRecipes();

    // 2. Subscribe to query param changes to ONLY re-filter the data.
    this.route.queryParams.subscribe(params => {
      // Handle mealType parameter
      let mealTypeParam = params['mealType'] || null;
      if (mealTypeParam && mealTypeParam.toLowerCase() === 'snacks') {
        mealTypeParam = 'Snack';
      }
      this.mealType = mealTypeParam;

      // Handle cuisine parameter
      this.cuisine = params['cuisine'] || null;

      // Do not call loadRecipes() here. Call filterRecipes() instead.
      this.filterRecipes();
    });

  }

  loadRecipes() {
    this.recipeService.getAllRecipes().subscribe(data => {
      this.recipes = data;
      this.filterRecipes();
      this.loading = false;
    });
  }

  filterRecipes() {
    if (this.cuisine) {
      // Filter by cuisine if cuisine parameter is present
      this.filteredRecipes = this.recipes.filter(recipe =>
        recipe.cuisine && recipe.cuisine.toLowerCase() === this.cuisine!.toLowerCase()
      );
    } else if (this.mealType) {
      // Filter by mealType if mealType parameter is present
      this.filteredRecipes = this.recipes.filter(recipe =>
        recipe.mealType.toLowerCase() === this.mealType!.toLowerCase()
      );
    } else {
      // Show all recipes if no filter is applied
      this.filteredRecipes = this.recipes;
    }
  }
}
