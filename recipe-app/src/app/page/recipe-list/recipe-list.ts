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

  constructor(private recipeService: RecipeService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.mealType = params['mealType'] || null;
      this.loadRecipes();
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
    if (this.mealType) {
      this.filteredRecipes = this.recipes.filter(recipe =>
        recipe.mealType.toLowerCase() === this.mealType!.toLowerCase()
      );
    } else {
      this.filteredRecipes = this.recipes;
    }
  }
}
