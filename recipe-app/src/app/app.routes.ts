// import { Routes } from '@angular/router';

// // export const routes: Routes = [];

// import { HomeComponent } from './page/home/home';
// import { LoginComponent } from './page/login/login';
// import { SignUpComponent } from './page/signup/signup';
// import { MyRecipesComponent } from './page/my-recipes/my-recipes';
// import { RecipeDetailComponent } from './page/recipe-detail/recipe-detail';
// import { authGuard } from './guards/auth-guard-guard';
// // import { CreateRecipeComponent } from './page/create-recipe/create-recipe';
// import { RecipeListComponent } from './page/recipe-list/recipe-list';

// export const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'signup', component: SignUpComponent },
//   { 
//     path: 'my-recipes', 
//     component: MyRecipesComponent,
//     canActivate: [authGuard] 
//   },
//   // {
//   //   path: 'create-recipe',
//   //   component: CreateRecipeComponent,
//   //   canActivate: [authGuard],
//   // },
//   { path: 'recipes', component: RecipeListComponent },
//   { path: 'recipes/:id', component: RecipeDetailComponent },
//   // This handles the '/recipe/:id' route from your React app
//   { path: 'recipe/:id', component: RecipeDetailComponent }, 
//   { path: '**', redirectTo: '' }
// ];


import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard-guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./page/home/home').then(m => m.HomeComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./page/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'signup', 
    loadComponent: () => import('./page/signup/signup').then(m => m.SignUpComponent) 
  },
  { 
    path: 'my-recipes', 
    loadComponent: () => import('./page/my-recipes/my-recipes').then(m => m.MyRecipesComponent),
    canActivate: [authGuard] 
  },
  // {
  //   path: 'create-recipe',
  //   loadComponent: () => import('./page/create-recipe/create-recipe').then(m => m.CreateRecipeComponent),
  //   canActivate: [authGuard],
  // },
  { 
    path: 'recipes', 
    loadComponent: () => import('./page/recipe-list/recipe-list').then(m => m.RecipeListComponent) 
  },
  { 
    path: 'recipes/:id', 
    loadComponent: () => import('./page/recipe-detail/recipe-detail').then(m => m.RecipeDetailComponent) 
  },
  // This handles the '/recipe/:id' route from your React app
  { 
    path: 'recipe/:id', 
    loadComponent: () => import('./page/recipe-detail/recipe-detail').then(m => m.RecipeDetailComponent) 
  }, 
  { 
    path: '**', 
    redirectTo: '' 
  }
];