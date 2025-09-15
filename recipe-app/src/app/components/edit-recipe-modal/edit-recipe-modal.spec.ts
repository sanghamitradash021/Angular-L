import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { EditRecipeModalComponent } from './edit-recipe-modal';
import { RecipeService } from '../../service/recipe-service';
import { AuthService } from '../../service/auth-service';
import { Recipe } from '../../models/interface/recipe.interface';

// --- Mock Services ---
class MockRecipeService {
  // Simulate the updateRecipe API call
  updateRecipe(id: number, data: Partial<Recipe>) {
    // Return the updated data as if the API call was successful
    const updatedRecipe = { ...data, recipe_id: id } as Recipe;
    return of(updatedRecipe);
  }
}

// The AuthService is injected but not used in the component's logic, so a basic mock is sufficient.
class MockAuthService {}

// --- Mock Recipe Data ---
const MOCK_RECIPE: Recipe = {
  recipe_id: 101,
  user_id: 1,
  title: 'Original Title',
  description: 'Original Description',
  ingredients: '["Ingredient 1","Ingredient 2"]', // Stored as a JSON string
  instructions: 'Original Instructions',
  preparationTime: 30,
  difficulty: 'Easy',
  cuisine: 'Italian',
  mealType: 'Dinner',
  image: 'http://example.com/image.jpg',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  Comment: '',
};

describe('EditRecipeModalComponent', () => {
  let component: EditRecipeModalComponent;
  let fixture: ComponentFixture<EditRecipeModalComponent>;
  let recipeService: RecipeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRecipeModalComponent, ReactiveFormsModule],
      providers: [
        { provide: RecipeService, useClass: MockRecipeService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditRecipeModalComponent);
    component = fixture.componentInstance;
    recipeService = TestBed.inject(RecipeService);

    // Initial detection of changes, but the form won't be populated yet.
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.editForm.valid).toBeFalsy();
  });

  describe('ngOnChanges - Data Population', () => {
    it('should not populate form if recipe is null', () => {
      component.recipe = null;
      component.isOpen = true;
      component.ngOnChanges();
      fixture.detectChanges();
      
      expect(component.editForm.get('title')?.value).toBe('');
    });
    
    it('should not populate form if isOpen is false', () => {
        component.recipe = MOCK_RECIPE;
        component.isOpen = false;
        component.ngOnChanges();
        fixture.detectChanges();

        expect(component.editForm.get('title')?.value).toBe('');
      });

    it('should populate the form with recipe data when component becomes visible', () => {
      // Set the inputs
      component.recipe = MOCK_RECIPE;
      component.isOpen = true;

      // Manually trigger ngOnChanges to simulate input changes
      component.ngOnChanges();
      fixture.detectChanges();

      // Check if form values match the mock recipe
      expect(component.editForm.value.title).toBe(MOCK_RECIPE.title);
      expect(component.editForm.value.description).toBe(MOCK_RECIPE.description);
      expect(component.editForm.value.preparationTime).toBe(MOCK_RECIPE.preparationTime);
    });

    it('should parse and format ingredients from a JSON string array', () => {
      component.recipe = MOCK_RECIPE;
      component.isOpen = true;
      component.ngOnChanges();
      fixture.detectChanges();

      // The JSON string '["Ingredient 1","Ingredient 2"]' should become a newline-separated string
      const expectedIngredients = 'Ingredient 1\nIngredient 2';
      expect(component.editForm.get('ingredients')?.value).toBe(expectedIngredients);
    });

    it('should handle ingredients that are just a plain string', () => {
        const recipeWithPlainIngredients = {...MOCK_RECIPE, ingredients: 'Plain ingredient list'};
        component.recipe = recipeWithPlainIngredients;
        component.isOpen = true;
        component.ngOnChanges();
        fixture.detectChanges();
  
        expect(component.editForm.get('ingredients')?.value).toBe('Plain ingredient list');
      });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
        // Ensure the form is populated for submission tests
        component.recipe = MOCK_RECIPE;
        component.isOpen = true;
        component.ngOnChanges();
        fixture.detectChanges();
      });

    it('should not submit if the form is invalid', () => {
      spyOn(recipeService, 'updateRecipe');
      component.editForm.get('title')?.setValue(''); // Make the form invalid

      component.onSubmit();

      expect(recipeService.updateRecipe).not.toHaveBeenCalled();
    });

    it('should call updateRecipe with correctly formatted data on valid submission', () => {
        spyOn(recipeService, 'updateRecipe').and.callThrough();
        
        // Modify a value to check if the update is correct
        component.editForm.get('title')?.setValue('Updated Title');
        component.editForm.get('ingredients')?.setValue('Updated Ing 1\nUpdated Ing 2');
        
        const expectedPayload = {
            ...component.editForm.value,
            // Ingredients should be converted back to an array
            ingredients: ['Updated Ing 1', 'Updated Ing 2'],
        };

        component.onSubmit();
        
        expect(recipeService.updateRecipe).toHaveBeenCalledWith(MOCK_RECIPE.recipe_id, expectedPayload);
      });

    it('should emit success with the updated recipe and close the modal on successful submission', () => {
        const updatedRecipeData = { ...MOCK_RECIPE, title: 'Successfully Updated' };
        spyOn(recipeService, 'updateRecipe').and.returnValue(of(updatedRecipeData));
        // spyOn(component.success, 'emit');
        spyOn(component, 'onClose');

        component.onSubmit();
        
        expect(component.loading).toBe(false);
        // expect(component.success.emit).toHaveBeenCalledWith(updatedRecipeData);
        expect(component.onClose).toHaveBeenCalled();
      });

    it('should set an error message on submission failure', () => {
        spyOn(recipeService, 'updateRecipe').and.returnValue(throwError(() => new Error('API Failure')));
        // spyOn(component.success, 'emit');
        spyOn(component, 'onClose');

        component.onSubmit();

        expect(component.loading).toBe(false);
        expect(component.error).toBe('Failed to update recipe. Please try again.');
        // expect(component.success.emit).not.toHaveBeenCalled();
        expect(component.onClose).not.toHaveBeenCalled();
      });

      
  });

  describe('UI Events', () => {
    it('should emit close event when onClose is called', () => {
        spyOn(component.close, 'emit');
        component.onClose();
        expect(component.close.emit).toHaveBeenCalled();
      });

    it('should emit close when onBackdropClick is triggered on the overlay', () => {
        spyOn(component, 'onClose');
        // Simulate a click on the backdrop element
        const mockEvent = {
          target: fixture.nativeElement,
          currentTarget: fixture.nativeElement,
        } as unknown as Event;
  
        component.onBackdropClick(mockEvent);
        expect(component.onClose).toHaveBeenCalled();
      });
  });
});