import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, ReplaySubject } from 'rxjs';

import { RecipeListComponent } from './recipe-list';
import { RecipeService } from '../../service/recipe-service';
import { Recipe } from '../../models/interface/recipe.interface';

// --- Mock Data ---
const MOCK_RECIPES: Recipe[] = [
  { recipe_id: 1, title: 'Pancakes', mealType: 'Breakfast' } as Recipe,
  { recipe_id: 2, title: 'Salad', mealType: 'Lunch' } as Recipe,
  { recipe_id: 3, title: 'Steak', mealType: 'Dinner' } as Recipe,
  { recipe_id: 4, title: 'Omelette', mealType: 'Breakfast' } as Recipe,
];

// --- Mock Services ---
class MockRecipeService {
  // Use a spy to ensure it's only called when necessary
  getAllRecipes = jasmine.createSpy('getAllRecipes').and.returnValue(of(MOCK_RECIPES));
}

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let recipeService: RecipeService;
  
  // Use a ReplaySubject to easily simulate query param changes
  let queryParamsSubject: ReplaySubject<any>;

  // Helper function for setting up the test bed
  const setupTest = () => {
    queryParamsSubject = new ReplaySubject(1); // Buffer size of 1

    TestBed.configureTestingModule({
      imports: [RecipeListComponent, RouterTestingModule],
      providers: [
        { provide: RecipeService, useClass: MockRecipeService },
        {
          provide: ActivatedRoute,
          useValue: {
            // Use the subject for the queryParams observable
            queryParams: queryParamsSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    recipeService = TestBed.inject(RecipeService);
  };

  beforeEach(() => {
    setupTest();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Data Loading and Filtering via Route Params', () => {
    it('should load all recipes and display them all when no mealType is provided', () => {
      // Simulate route with no query params
      queryParamsSubject.next({});
      fixture.detectChanges(); // Triggers ngOnInit

      expect(recipeService.getAllRecipes).toHaveBeenCalled();
      expect(component.recipes.length).toBe(4);
      expect(component.filteredRecipes.length).toBe(4); // All recipes should be shown
      expect(component.mealType).toBeNull();
      expect(component.loading).toBe(false);
    });

    it('should load all recipes but filter them when a mealType is provided', () => {
      // Simulate route with ?mealType=Breakfast
      queryParamsSubject.next({ mealType: 'Breakfast' });
      fixture.detectChanges();

      expect(recipeService.getAllRecipes).toHaveBeenCalled();
      expect(component.recipes.length).toBe(4); // Still holds all recipes
      expect(component.filteredRecipes.length).toBe(2); // But only shows breakfast ones
      expect(component.filteredRecipes[0].title).toBe('Pancakes');
      expect(component.filteredRecipes[1].title).toBe('Omelette');
      expect(component.mealType).toBe('Breakfast');
      expect(component.loading).toBe(false);
    });

    it('should handle case-insensitivity in mealType parameter', () => {
      // Simulate route with ?mealType=breakfast (lowercase)
      queryParamsSubject.next({ mealType: 'breakfast' });
      fixture.detectChanges();

      expect(component.filteredRecipes.length).toBe(2);
      expect(component.mealType).toBe('breakfast');
    });

    it('should show an empty list if no recipes match the mealType', () => {
        queryParamsSubject.next({ mealType: 'Dessert' });
        fixture.detectChanges();
  
        expect(component.recipes.length).toBe(4);
        expect(component.filteredRecipes.length).toBe(0); // No desserts in mock data
        expect(component.mealType).toBe('Dessert');
      });

    it('should re-filter recipes when query params change after initialization', () => {
        // Initial load with no filter
        queryParamsSubject.next({});
        fixture.detectChanges();
        expect(component.filteredRecipes.length).toBe(4);

        // Simulate navigation to a new URL with a filter
        queryParamsSubject.next({ mealType: 'Lunch' });
        fixture.detectChanges();

        // The service should NOT be called again, but filtering should re-run
        expect(recipeService.getAllRecipes).toHaveBeenCalledTimes(1);
        expect(component.filteredRecipes.length).toBe(1);
        expect(component.filteredRecipes[0].title).toBe('Salad');
        expect(component.mealType).toBe('Lunch');
      });
  });
});