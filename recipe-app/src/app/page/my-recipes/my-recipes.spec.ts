import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError, Subject } from 'rxjs';

import { MyRecipesComponent } from './my-recipes';
import { RecipeService } from '../../service/recipe-service';
import { AuthService } from '../../service/auth-service';
import { RecipeEventsService } from '../../service/recipe-events.service';
import { Recipe } from '../../models/interface/recipe.interface';
import { EditRecipeModalComponent } from '../../components/edit-recipe-modal/edit-recipe-modal';
import { DeleteConfirmationModalComponent } from '../../components/delete-confirmation-modal/delete-confirmation-modal';
import { NGXLogger } from 'ngx-logger';

// --- Mock Child Components ---
@Component({ selector: 'app-edit-recipe-modal', standalone: true, template: '' })
class MockEditRecipeModalComponent {
  @Input() isOpen: boolean = false;
  @Input() recipe: Recipe | null = null;
  @Output() close = new EventEmitter<void>();
}

@Component({ selector: 'app-delete-confirmation-modal', standalone: true, template: '' })
class MockDeleteConfirmationModalComponent {
  @Input() isOpen: boolean = false;
  @Input() recipeTitle: string = '';
  @Input() isDeleting: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}

// --- Mock Data ---
const MOCK_RECIPES_BASE: Recipe[] = [
  { recipe_id: 1, title: 'Zucchini Pasta', cuisine: 'Italian', difficulty: 'Easy', createdAt: '2023-01-01T10:00:00Z' } as Recipe,
  { recipe_id: 2, title: 'Apple Pie', cuisine: 'American', difficulty: 'Medium', createdAt: '2023-03-15T12:00:00Z' } as Recipe,
  { recipe_id: 3, title: 'Chicken Curry', cuisine: 'Indian', difficulty: 'Hard', createdAt: '2023-02-20T18:00:00Z' } as Recipe,
];

// --- Mock Services ---
class MockAuthService {
  getUserId = jasmine.createSpy('getUserId').and.returnValue('user123');
}

class MockRecipeService {
  getMyRecipes = jasmine.createSpy('getMyRecipes');
  deleteRecipe = jasmine.createSpy('deleteRecipe');
}

class MockRecipeEventsService {
  recipeCreated$ = new Subject<Recipe>();
  recipeUpdated$ = new Subject<Recipe>();
  recipeDeleted$ = new Subject<number>();
  emitRecipeUpdated = jasmine.createSpy('emitRecipeUpdated');
  emitRecipeDeleted = jasmine.createSpy('emitRecipeDeleted');
}

class MockLogger {
  log(...args: any[]) {}
  debug(...args: any[]) {}
  error(...args: any[]) {}
}

describe('MyRecipesComponent', () => {
  let component: MyRecipesComponent;
  let fixture: ComponentFixture<MyRecipesComponent>;
  let recipeService: RecipeService;
  let authService: AuthService;
  let recipeEventsService: MockRecipeEventsService;
  
  let freshMockRecipes: Recipe[];

  beforeEach(async () => {
    freshMockRecipes = [...MOCK_RECIPES_BASE];
    
    await TestBed.configureTestingModule({
      imports: [MyRecipesComponent, FormsModule, RouterTestingModule],
      providers: [
        { provide: RecipeService, useClass: MockRecipeService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: RecipeEventsService, useClass: MockRecipeEventsService },
        { provide: NGXLogger, useClass: MockLogger },
      ],
    })
    .overrideComponent(MyRecipesComponent, {
        remove: { imports: [EditRecipeModalComponent, DeleteConfirmationModalComponent] },
        add: { imports: [MockEditRecipeModalComponent, MockDeleteConfirmationModalComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRecipesComponent);
    component = fixture.componentInstance;
    
    recipeService = TestBed.inject(RecipeService);
    authService = TestBed.inject(AuthService);
    recipeEventsService = TestBed.inject(RecipeEventsService) as unknown as MockRecipeEventsService;

    (recipeService.getMyRecipes as jasmine.Spy).and.returnValue(of(freshMockRecipes));
    (recipeService.deleteRecipe as jasmine.Spy).and.returnValue(of({ success: true }));
    (authService.getUserId as jasmine.Spy).and.returnValue(123);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // --- RESTORED TESTS ---
  describe('Initialization and Data Loading', () => {
    it('should load recipes on init if user is logged in', () => {
      fixture.detectChanges();
      expect(authService.getUserId).toHaveBeenCalled();
      expect(recipeService.getMyRecipes).toHaveBeenCalledWith(123);
      expect(component.myRecipes.length).toBe(3);
      expect(component.loading).toBe(false);
    });

    it('should not load recipes if user is not logged in', () => {
        (authService.getUserId as jasmine.Spy).and.returnValue(null);
        fixture.detectChanges();
        expect(recipeService.getMyRecipes).not.toHaveBeenCalled();
        expect(component.loading).toBe(true);
      });

    it('should handle errors during recipe fetching', () => {
      (recipeService.getMyRecipes as jasmine.Spy).and.returnValue(throwError(() => new Error('API Error')));
      fixture.detectChanges();
      expect(component.error).toBe('Failed to fetch your recipes.');
      expect(component.myRecipes.length).toBe(0);
      expect(component.loading).toBe(false);
    });
  });

  describe('User Actions (Delete and Edit)', () => {
    beforeEach(() => {
        fixture.detectChanges();
      });
    
    it('should open the edit modal with the correct recipe', () => {
        const recipeToEdit = component.myRecipes[0];
        component.openEditModal(recipeToEdit);
        expect(component.isEditModalOpen).toBe(true);
        expect(component.selectedRecipe).toBe(recipeToEdit);
      });
    
    it('should set recipeToDelete and open the delete modal when deleteRecipe is called', () => {
        const recipeToDelete = component.myRecipes[1];
        component.deleteRecipe(recipeToDelete.recipe_id);
        expect(component.isDeleteModalOpen).toBe(true);
        expect(component.recipeToDelete).toBe(recipeToDelete);
      });

    it('should call delete service when confirmDelete is called', () => {
        const recipeToDelete = component.myRecipes[1];
        component.recipeToDelete = recipeToDelete;
        component.confirmDelete();
        expect(recipeService.deleteRecipe).toHaveBeenCalledWith(recipeToDelete.recipe_id);
      });
  });

  describe('Event Handling from RecipeEventsService', () => {
    beforeEach(() => {
        fixture.detectChanges();
    });

    it('should add a new recipe to the list when a recipeCreated event is emitted', () => {
        const newRecipe: Recipe = { recipe_id: 4, title: 'New Dish' } as Recipe;
        recipeEventsService.recipeCreated$.next(newRecipe);
        expect(component.myRecipes.length).toBe(4);
        expect(component.myRecipes[0].title).toBe('New Dish');
    });

    it('should update a recipe in the list when a recipeUpdated event is emitted', () => {
        const updatedRecipe: Recipe = { ...component.myRecipes[0], title: 'Updated Title' };
        recipeEventsService.recipeUpdated$.next(updatedRecipe);
        expect(component.myRecipes.find(r => r.recipe_id === updatedRecipe.recipe_id)?.title).toBe('Updated Title');
      });

    it('should remove a recipe from the list when a recipeDeleted event is emitted', () => {
        const recipeIdToDelete = component.myRecipes[1].recipe_id;
        recipeEventsService.recipeDeleted$.next(recipeIdToDelete);
        expect(component.myRecipes.length).toBe(2);
        expect(component.myRecipes.find(r => r.recipe_id === recipeIdToDelete)).toBeUndefined();
    });

    it('should unsubscribe from all subscriptions on destroy', () => {
        spyOn((component as any).subscriptions, 'unsubscribe');
        component.ngOnDestroy();
        expect((component as any).subscriptions.unsubscribe).toHaveBeenCalled();
      });
  });
  
  describe('Sorting Logic', () => {
    beforeEach(() => {
        fixture.detectChanges();
    });

    it('should sort by newest (default)', () => {
        expect(component.myRecipes.map(r => r.recipe_id)).toEqual([2, 3, 1]);
    });

    it('should sort by cuisine alphabetically', () => {
        component.sortBy = 'cuisine';
        component.sortRecipes();
        expect(component.myRecipes.map(r => r.cuisine)).toEqual(['American', 'Indian', 'Italian']);
    });
    
    it('should sort by title alphabetically', () => {
        component.sortBy = 'title';
        component.sortRecipes();
        expect(component.myRecipes.map(r => r.title)).toEqual(['Apple Pie', 'Chicken Curry', 'Zucchini Pasta']);
    });

    it('should sort by difficulty (Easy, Medium, Hard)', () => {
        component.sortBy = 'difficulty';
        component.sortRecipes();
        expect(component.myRecipes.map(r => r.difficulty)).toEqual(['Easy', 'Medium', 'Hard']);
    });
  });
});