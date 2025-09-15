import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { NavbarComponent } from './navbar';
import { AuthService } from '../../service/auth-service';
import { RecipeService } from '../../service/recipe-service';
import { RecipeEventsService } from '../../service/recipe-events.service';
import { Recipe } from '../../models/interface/recipe.interface';
import { User } from '../../models/interface/user.interface';
import { CloudinaryService } from '../../service/cloudinary.service';
// --- 1. IMPORT THE LOGGER TO BE MOCKED ---
import { NGXLogger } from 'ngx-logger';

// --- Mock Data ---
const MOCK_USER: User = { id: 1, username: 'TestUser' } as User;
const MOCK_RECIPES: Recipe[] = [ { recipe_id: 1, title: 'Pasta Carbonara' } as Recipe ];

// --- Mock Services ---
let mockCurrentUser: WritableSignal<User | null>;

class MockAuthService {
  currentUser = mockCurrentUser.asReadonly();
  logout = jasmine.createSpy('logout').and.callFake(() => {
    mockCurrentUser.set(null);
  });
}

class MockRecipeService {
  searchRecipes = jasmine.createSpy('searchRecipes').and.returnValue(of(MOCK_RECIPES));
}

class MockRecipeEventsService {
  emitRecipeCreated = jasmine.createSpy('emitRecipeCreated');
}

class MockCloudinaryService {
  uploadImage(file: File) {
    return of('mock-image-url.jpg');
  }
}

// --- 2. CREATE A MOCK FOR NGXLogger ---
class MockLogger {
  info(...args: any[]) {}
  log(...args: any[]) {}
  debug(...args: any[]) {}
  error(...args: any[]) {}
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(async () => {
    mockCurrentUser = signal<User | null>(null);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, FormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: RecipeService, useClass: MockRecipeService },
        { provide: RecipeEventsService, useClass: MockRecipeEventsService },
        { provide: CloudinaryService, useClass: MockCloudinaryService },
        // --- 3. PROVIDE THE MOCK LOGGER ---
        { provide: NGXLogger, useClass: MockLogger },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // No other changes are needed. The rest of your tests were logically correct.
  // The failure was happening during component creation.

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Authentication State', () => {
    it('should show Login button when logged out', () => {
      mockCurrentUser.set(null);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('a[routerLink="/login"]')).not.toBeNull();
    });

    it('should show user menu when logged in', () => {
      mockCurrentUser.set(MOCK_USER);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('TestUser');
    });
  });

  describe('User Dropdown and Navigation', () => {
    beforeEach(() => {
        mockCurrentUser.set(MOCK_USER);
        fixture.detectChanges();
      });

    it('should navigate to my-recipes and close the dropdown', () => {
        spyOn(router, 'navigate');
        component.isDropdownOpen = true;
        component.navigateToMyRecipes();
        expect(router.navigate).toHaveBeenCalledWith(['/my-recipes']);
        expect(component.isDropdownOpen).toBe(false);
      });
  });

  describe('Search Functionality', () => {
    it('should perform a debounced search on input', fakeAsync(() => {
        const recipeService = TestBed.inject(RecipeService);
        component.searchQuery = 'Pasta';
        component.onSearchInput();
        expect(recipeService.searchRecipes).not.toHaveBeenCalled();
        tick(300);
        expect(recipeService.searchRecipes).toHaveBeenCalledWith('Pasta');
      }));
  });
});