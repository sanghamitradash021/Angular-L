import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CreateRecipeComponent } from './create-recipe';
// --- 1. IMPORT THE REAL COMPONENT THAT YOU WANT TO REPLACE ---
import { CreateRecipeModalComponent as RealCreateRecipeModalComponent } from '../../components/create-recipe-modal/create-recipe-modal';

// --- Mock Child Component ---
@Component({
  selector: 'app-create-recipe-modal', // Must have the same selector as the real one
  standalone: true,
  template: '',
})
class MockCreateRecipeModalComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();
}

describe('CreateRecipeComponent', () => {
  let component: CreateRecipeComponent;
  let fixture: ComponentFixture<CreateRecipeComponent>;
  let mockModal: MockCreateRecipeModalComponent;
  let historyBackSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRecipeComponent],
    })
    .overrideComponent(CreateRecipeComponent, {
        // --- 2. THE FIX: CORRECTLY SWAP THE IMPORTS ---
        // REMOVE the REAL component from the list of imports
        remove: { imports: [RealCreateRecipeModalComponent] },
        // ADD the MOCK component to the list of imports
        add: { imports: [MockCreateRecipeModalComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRecipeComponent);
    component = fixture.componentInstance;

    historyBackSpy = spyOn(window.history, 'back');
    fixture.detectChanges();

    const mockModalDebugElement = fixture.debugElement.childNodes[0];
    // Add a check to ensure we found the mock modal before accessing its instance
    if (mockModalDebugElement) {
        mockModal = mockModalDebugElement.componentInstance;
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the app-create-recipe-modal component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-create-recipe-modal')).not.toBeNull();
  });

  it('should pass isOpen=true to the modal component', () => {
    // Add a check to ensure the mockModal was found before testing it
    expect(mockModal).toBeTruthy();
    expect(mockModal.isOpen).toBe(true);
  });

  it('should call window.history.back when the modal emits a "close" event', () => {
    expect(mockModal).toBeTruthy();
    mockModal.close.emit();
    expect(historyBackSpy).toHaveBeenCalled();
  });

  it('should call window.history.back when the modal emits a "success" event', () => {
    expect(mockModal).toBeTruthy();
    mockModal.success.emit();
    expect(historyBackSpy).toHaveBeenCalled();
  });
});