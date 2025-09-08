import { ComponentFixture, TestBed } from '@angular/core/testing';

import {EditRecipeModalComponent } from './edit-recipe-modal';

describe('EditRecipeModal', () => {
  let component: EditRecipeModalComponent;
  let fixture: ComponentFixture<EditRecipeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRecipeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRecipeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
