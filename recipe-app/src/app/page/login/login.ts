// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   imports: [],
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class Login {

// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth-service';
import { NGXLogger } from 'ngx-logger';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  loading: boolean | undefined;
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private logger: NGXLogger
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // onSubmit() {
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //   this.error = '';
  //   this.authService.login(this.loginForm.value).subscribe({
  //     next: () => {
  //       // toast.success('Logged in successfully!'); can be replaced with a snackbar service
  //       this.router.navigate(['/']);
  //     },
  //     error: (err) => {
  //       this.error = err.error.message || 'Login failed. Please try again.';
  //     }
  //   });
  // }

  onLogin() {
  this.loading = true;
  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      this.logger.info('Login successful:', response);
      this.loading = false;
      // The AuthService will automatically update the currentUser signal
      // This will trigger the navbar to show the username and Create Recipe button
      this.router.navigate(['/']);
    },
    error: (error) => {
      this.logger.error('Login failed:', error);
      this.loading = false;
      this.error = 'Login failed. Please check your credentials.';
    }
  });
}

}