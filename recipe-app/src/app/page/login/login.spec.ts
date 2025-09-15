import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login';
import { AuthService } from '../../service/auth-service';
// --- 1. IMPORT THE LOGGER TO BE MOCKED ---
import { NGXLogger } from 'ngx-logger';

// --- Mock Services ---
class MockAuthService {
  login = jasmine.createSpy('login').and.returnValue(of({ token: 'mock-token' }));
}

// --- 2. CREATE A MOCK FOR NGXLogger ---
// It only needs the methods that your component actually calls (info, error).
class MockLogger {
  info(...args: any[]) {}
  error(...args: any[]) {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        // --- 3. PROVIDE THE MOCK LOGGER ---
        { provide: NGXLogger, useClass: MockLogger },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });
  
  // No other changes are needed. The rest of your tests were logically correct.
  // The failure was happening during component creation.

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization and Validation', () => {
    it('should create a loginForm with email and password controls', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('email')).toBeDefined();
      expect(component.loginForm.get('password')).toBeDefined();
    });

    it('should make the form valid when both fields are correctly filled', () => {
        component.loginForm.get('email')?.setValue('test@example.com');
        component.loginForm.get('password')?.setValue('password123');
        expect(component.loginForm.valid).toBeTruthy();
      });
  });

  describe('onLogin Submission', () => {
    beforeEach(() => {
        component.loginForm.get('email')?.setValue('test@example.com');
        component.loginForm.get('password')?.setValue('password123');
      });

    it('should call authService.login and navigate to home on successful login', () => {
      spyOn(router, 'navigate');
      
      component.onLogin();

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should set an error message and not navigate on failed login', () => {
        (authService.login as jasmine.Spy).and.returnValue(throwError(() => new Error('Invalid credentials')));
        spyOn(router, 'navigate');

        component.onLogin();

        expect(authService.login).toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        expect(component.error).toBe('Login failed. Please check your credentials.');
      });

    it('should set the loading state to true during login and false after completion', () => {
      spyOn(router, 'navigate');
      expect(component.loading).toBeUndefined();

      component.onLogin();

      // Because the mock uses `of()`, the observable is synchronous.
      // The entire process completes in one go. We test the final state.
      expect(component.loading).toBe(false); 
    });
  });
});