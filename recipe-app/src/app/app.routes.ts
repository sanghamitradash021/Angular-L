import { Routes } from '@angular/router';

// export const routes: Routes = [];

import { HomeComponent } from './page/home/home';
import { LoginComponent } from './page/login/login';
import { SignUpComponent } from './page/signup/signup';
import { MyRecipesComponent } from './page/my-recipes/my-recipes';
import { RecipeDetailComponent } from './page/recipe-detail/recipe-detail';
import { authGuard } from './guards/auth-guard-guard';
import { CreateRecipeComponent } from './page/create-recipe/create-recipe';
import { RecipeListComponent } from './page/recipe-list/recipe-list';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { 
    path: 'my-recipes', 
    component: MyRecipesComponent,
    canActivate: [authGuard] 
  },
  {
    path: 'create-recipe',
    component: CreateRecipeComponent,
    canActivate: [authGuard],
  },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/:id', component: RecipeDetailComponent },
  // This handles the '/recipe/:id' route from your React app
  { path: 'recipe/:id', component: RecipeDetailComponent }, 
  { path: '**', redirectTo: '' }
];