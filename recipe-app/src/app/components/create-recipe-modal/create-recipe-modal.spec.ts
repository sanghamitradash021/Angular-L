import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CreateRecipeModalComponent } from './create-recipe-modal';
import { RecipeService } from '../../service/recipe-service';
import { AuthService } from '../../service/auth-service';
import { CloudinaryService } from '../../service/cloudinary.service';
import { Recipe } from '../../models/interface/recipe.interface';
// --- 1. IMPORT THE LOGGER TO BE MOCKED ---
import { NGXLogger } from 'ngx-logger';

// --- Mocks for the services ---
class MockAuthService {
  getUserId() {
    return '123';
  }
}

class MockRecipeService {
  createRecipe(data: any) {
    const mockRecipe: Recipe = {
      recipe_id: 101,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Recipe;
    return of({ message: 'Success', recipeId: 101, recipe: mockRecipe });
  }
}

class MockCloudinaryService {
  uploadImage(file: File) {
    return of('http://mock-cloudinary-url.com/image.jpg');
  }
}

// --- 2. CREATE A MOCK FOR NGXLogger ---
// It only needs the methods that your component actually calls.
class MockLogger {
  log(...args: any[]) {}
  debug(...args: any[]) {}
  error(...args: any[]) {}
}


describe('CreateRecipeModalComponent', () => {
  let component: CreateRecipeModalComponent;
  let fixture: ComponentFixture<CreateRecipeModalComponent>;
  let recipeService: RecipeService;
  let authService: AuthService;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRecipeModalComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: RecipeService, useClass: MockRecipeService },
        { provide: CloudinaryService, useClass: MockCloudinaryService },
        // --- 3. PROVIDE THE MOCK LOGGER ---
        { provide: NGXLogger, useClass: MockLogger },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRecipeModalComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    recipeService = TestBed.inject(RecipeService);
    cloudinaryService = TestBed.inject(CloudinaryService);

    fixture.detectChanges();
  });

  // No other changes are needed. The rest of your tests were logically correct.
  // The failure was happening during component creation, before any tests could run.

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should create a recipeForm with all required controls', () => {
      expect(component.recipeForm.contains('title')).toBe(true);
      expect(component.recipeForm.contains('description')).toBe(true);
    });

    it('should set default difficulty to "Medium"', () => {
      expect(component.recipeForm.get('difficulty')?.value).toBe('Medium');
    });

    it('should be invalid when empty', () => {
      expect(component.recipeForm.valid).toBeFalsy();
    });
  });

  describe('Validation and Error Handling', () => {
    it('should get correct error message for a required field', () => {
      const titleControl = component.recipeForm.get('title');
      titleControl?.markAsTouched();
      expect(component.getFieldError('title')).toBe('title is required');
    });
  });

  describe('Event Emitters and UI interaction', () => {
    it('should emit "close" event and reset form when onClose is called', () => {
      spyOn(component.close, 'emit');
      spyOn(component as any, 'resetForm').and.callThrough();

      component.onClose();

      expect(component.close.emit).toHaveBeenCalled();
      expect((component as any).resetForm).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    const fillForm = () => {
        component.recipeForm.setValue({
          title: 'Test Recipe',
          description: 'A delicious test recipe.',
          ingredients: '1 cup of testing',
          instructions: 'Mix all the tests together.',
          preparationTime: 30,
          difficulty: 'Easy',
          cuisine: 'Italian',
          mealType: 'Dinner',
          image: null,
        });
      };

    it('should not submit if the form is invalid', () => {
      spyOn(recipeService, 'createRecipe');
      component.onSubmit();
      expect(recipeService.createRecipe).not.toHaveBeenCalled();
    });

    it('should upload image and then create recipe if an image is provided', () => {
        fillForm();
        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        component.recipeForm.get('image')?.setValue(mockFile);

        const expectedPayload = {
            ...component.recipeForm.value,
            image: 'http://mock-cloudinary-url.com/image.jpg',
            user_id: '123'
        };
        
        spyOn(recipeService, 'createRecipe').and.callThrough();
        spyOn(component.success, 'emit');
        component.onSubmit();

        expect(recipeService.createRecipe).toHaveBeenCalledWith(expectedPayload);
        expect(component.success.emit).toHaveBeenCalled();
    });
  });
});