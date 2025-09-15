import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

import { RecipeDetailComponent } from './recipe-detail';
import { RecipeService } from '../../service/recipe-service';
import { AuthService } from '../../service/auth-service';
import { Recipe, Comment } from '../../models/interface/recipe.interface';
// --- 1. IMPORT THE LOGGER TO BE MOCKED ---
import { NGXLogger } from 'ngx-logger';

// --- Mock Data ---
const MOCK_RECIPE: Recipe = {
  recipe_id: 1,
  title: 'Test Pasta',
  description: 'A delicious test recipe.',
  ingredients: '["1 cup flour", "2 eggs"]',
  instructions: 'Mix and cook.',
  cuisine: 'Italian',
  mealType: 'Dinner',
  difficulty: 'Easy',
  preparationTime: 30,
  user_id: 123,
  image: 'pasta.jpg',
  userRating: 0,
} as Recipe;

const MOCK_COMMENTS: Comment[] = [
    { comment_id: 101, content: 'Great recipe!', username: 'UserA', createdAt: '2023-10-01T10:00:00Z', recipe_id: 1, user_id: 123, updatedAt: '2023-10-01T10:00:00Z' },
    { comment_id: 102, content: 'Very tasty.', username: 'UserB', createdAt: '2023-10-02T11:00:00Z', recipe_id: 1, user_id: 124, updatedAt: '2023-10-02T11:00:00Z' },
];

const USER_ID = 123;

// --- Mock Services ---
class MockRecipeService {
  getRecipeById = jasmine.createSpy('getRecipeById');
  getComments = jasmine.createSpy('getComments');
  addComment = jasmine.createSpy('addComment');
  addRating = jasmine.createSpy('addRating');
  getUserRating = jasmine.createSpy('getUserRating');
  getAverageRating = jasmine.createSpy('getAverageRating');
}

class MockAuthService {
  currentUser = signal(null);
  getUserId = jasmine.createSpy('getUserId');
}

// --- 2. CREATE A MOCK FOR NGXLogger ---
class MockLogger {
    debug(...args: any[]) {}
    log(...args: any[]) {}
    error(...args: any[]) {}
  }

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;
  let recipeService: RecipeService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecipeDetailComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: RecipeService, useClass: MockRecipeService },
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: MOCK_RECIPE.recipe_id.toString() }),
            },
          },
        },
        // --- 3. PROVIDE THE MOCK LOGGER ---
        { provide: NGXLogger, useClass: MockLogger },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeDetailComponent);
    component = fixture.componentInstance;
    
    recipeService = TestBed.inject(RecipeService);
    authService = TestBed.inject(AuthService);

    (recipeService.getRecipeById as jasmine.Spy).and.returnValue(of({ ...MOCK_RECIPE }));
    (recipeService.getComments as jasmine.Spy).and.returnValue(of([...MOCK_COMMENTS]));
    (recipeService.getUserRating as jasmine.Spy).and.returnValue(of({ userRating: 3 }));
    (recipeService.getAverageRating as jasmine.Spy).and.returnValue(of({ averageRating: 4.5 }));
    (recipeService.addComment as jasmine.Spy).and.returnValue(of({ comment_id: 103, content: 'New comment', username: 'CurrentUser', createdAt: '2023-10-03T12:00:00Z', recipe_id: 1, user_id: USER_ID, updatedAt: '2023-10-03T12:00:00Z' }));
    (recipeService.addRating as jasmine.Spy).and.returnValue(of({ success: true }));
    (authService.getUserId as jasmine.Spy).and.returnValue(USER_ID);
  });

  it('should create', () => {
    // The test was failing here before because the component couldn't be created.
    // Now it will pass.
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization and Data Loading', () => {
    it('should fetch recipe, comments, and user rating on init with a valid ID', () => {
      fixture.detectChanges();

      const recipeIdStr = MOCK_RECIPE.recipe_id.toString();
      const expectedFinalRecipeState = { ...MOCK_RECIPE, userRating: 3 };
      
      expect(recipeService.getRecipeById).toHaveBeenCalledWith(recipeIdStr);
      expect(component.recipe).toEqual(jasmine.objectContaining(expectedFinalRecipeState));
      expect(recipeService.getComments).toHaveBeenCalledWith(recipeIdStr);
      expect(component.comments).toEqual([...MOCK_COMMENTS]);
      expect(recipeService.getUserRating).toHaveBeenCalledWith(recipeIdStr, USER_ID);
    });
    
    it('getIngredients should parse a JSON string into a string array', () => {
        fixture.detectChanges();
        const ingredients = component.getIngredients();
        expect(ingredients).toEqual(['1 cup flour', '2 eggs']);
      });
  });

  describe('User Interactions (Comments and Ratings)', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call addComment service with correct parameters when submitting a valid comment', () => {
      const newCommentContent = 'This is a test comment';
      component.commentForm.get('content')?.setValue(newCommentContent);
      component.addComment();
      const recipeIdStr = MOCK_RECIPE.recipe_id.toString();
      expect(recipeService.addComment).toHaveBeenCalledWith(recipeIdStr, newCommentContent, USER_ID);
      expect(component.comments.length).toBe(3);
    });
    
    it('should not call addComment service if content is empty', () => {
        component.commentForm.get('content')?.setValue('   ');
        component.addComment();
        expect(recipeService.addComment).not.toHaveBeenCalled();
      });

    it('should call addRating service with correct parameters when a rating is given', () => {
        const rating = 5;
        component.addRating(rating);
        const recipeIdStr = MOCK_RECIPE.recipe_id.toString();
        expect(recipeService.addRating).toHaveBeenCalledWith(recipeIdStr, rating, USER_ID);
        expect(component.recipe?.userRating).toBe(rating);
        expect(recipeService.getAverageRating).toHaveBeenCalled();
      });
  });
});