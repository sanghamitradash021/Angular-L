// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-signup',
//   imports: [],
//   templateUrl: './signup.html',
//   styleUrl: './signup.css'
// })
// export class Signup {

// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './signup.html',
})
export class SignUpComponent {
  signupForm: FormGroup;
  error: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required],
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) return;
    
    this.loading = true;
    this.error = '';

    this.authService.signup(this.signupForm.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          // You might want to show a success message here
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error.message || 'Signup failed. Please try again.';
        }
      });
  }
}