// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-create-recipe',
//   imports: [],
//   templateUrl: './create-recipe.html',
//   styleUrl: './create-recipe.css'
// })
// export class CreateRecipe {

// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRecipeModalComponent } from '../../components/create-recipe-modal/create-recipe-modal';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [CommonModule, CreateRecipeModalComponent],
  template: `
    <app-create-recipe-modal 
      [isOpen]="true" 
      (close)="onModalClose()" 
      (success)="onSuccess()">
    </app-create-recipe-modal>
  `
})
export class CreateRecipeComponent {
  // In a real app, you might have a dedicated page for this
  // or a button that opens the modal.
  // This is a simple wrapper to show the modal via routing.
  
  onModalClose() {
    // Navigate back or to another page
    window.history.back();
  }

  onSuccess() {
    // Handle success, e.g., navigate to 'my-recipes'
    window.history.back();
  }
}