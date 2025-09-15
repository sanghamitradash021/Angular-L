import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router'; 
import { of } from 'rxjs';

import { HomeComponent } from './home';
import { RecipeService } from '../../service/recipe-service';
import { Recipe } from '../../models/interface/recipe.interface';

// --- Mock Data ---
const MOCK_RECIPES: Recipe[] = [
  { recipe_id: 1, title: 'Pasta Carbonara', mealType: 'Dinner' } as Recipe,
  { recipe_id: 2, title: 'Chicken Curry', mealType: 'Dinner' } as Recipe,
];

// --- Mock Services ---
class MockRecipeService {
  getAllRecipes() {
    return of(MOCK_RECIPES);
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: RecipeService, useClass: MockRecipeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    
    router = TestBed.inject(Router); 
    spyOn(router, 'navigate').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization (ngOnInit)', () => {
    it('should call getAllRecipes and populate recipes on init', () => {
      fixture.detectChanges(); 
      
      expect(component.allRecipes).toEqual(MOCK_RECIPES);
      expect(component.displayedRecipes.length).toBe(2); // Sliced to 6, but mock has 2
      expect(component.loading).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('should navigate to the correct route when navigateToMealType is called', () => {
      const mealType = 'Breakfast';
      component.navigateToMealType(mealType);

      expect(router.navigate).toHaveBeenCalledWith(
        ['/recipes'], 
        { queryParams: { mealType: 'breakfast' } }
      );
    });

    it('should navigate to /recipes when showAllRecipes is called', () => {
        component.showAllRecipes();
        expect(router.navigate).toHaveBeenCalledWith(['/recipes']);
    });
  });

  // --- THIS IS THE SECTION TO FIX ---
  describe('Manual Scrolling', () => {
    let scrollContainer: HTMLElement;
    let scrollBySpy: jasmine.Spy;

    beforeEach(() => {
        scrollContainer = document.createElement('div');
        // We can just add the class the component is looking for
        scrollContainer.classList.add('scrolling-container'); 
        
        spyOn(document, 'querySelector').and.returnValue(scrollContainer);

        scrollBySpy = spyOn(scrollContainer, 'scrollBy');
    });

    it('should call scrollBy with a negative value for scrollLeft', () => {
        component.scrollLeft();

        // FIX: Update the expected selector to match the component's code
        expect(document.querySelector).toHaveBeenCalledWith('.scrolling-container');
        expect(scrollBySpy).toHaveBeenCalledWith({ left: -320, behavior: 'smooth' });
    });

    it('should call scrollBy with a positive value for scrollRight', () => {
        component.scrollRight();

        // FIX: Update the expected selector to match the component's code
        expect(document.querySelector).toHaveBeenCalledWith('.scrolling-container');
        expect(scrollBySpy).toHaveBeenCalledWith({ left: 320, behavior: 'smooth' });
    });
  });

  describe('Toggle Scrolling Animation', () => {
    let scrollElement: HTMLElement;
  
    beforeEach(() => {
      scrollElement = document.createElement('div');
      scrollElement.classList.add('animate-scroll');
      
      spyOn(document, 'querySelector').and.returnValue(scrollElement);
    });
  
    it('should pause the animation when toggleScroll is called once', () => {
      component.isScrollingPaused = false;
      
      component.toggleScroll();
  
      expect(component.isScrollingPaused).toBe(true);
      expect(scrollElement.style.animationPlayState).toBe('paused');
    });
  
    it('should resume the animation when toggleScroll is called twice', () => {
      component.isScrollingPaused = true;
      
      component.toggleScroll();
  
      expect(component.isScrollingPaused).toBe(false);
      expect(scrollElement.style.animationPlayState).toBe('running');
    });
  });
});