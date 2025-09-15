import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError, Subject } from 'rxjs';

import { SignUpComponent } from './signup';
import { AuthService } from '../../service/auth-service';

// --- Mock Services ---
class MockAuthService {
  signup = jasmine.createSpy('signup').and.returnValue(of({ message: 'User created' }));
}

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    // --- THE FIX: Spy on the router to prevent actual navigation ---
    spyOn(router, 'navigate').and.stub();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // No changes needed below this line. The tests were already logically correct.
  // The spy above simply prevents the side-effect that was causing the failure.

  describe('Form Initialization and Validation', () => {
    it('should be valid when all fields are correctly filled', () => {
        component.signupForm.setValue({
          fullname: 'Test User',
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: 'user'
        });
        expect(component.signupForm.valid).toBeTruthy();
      });
  });

  describe('onSubmit Submission', () => {
    const validSignupData = {
        fullname: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
    };

    it('should call authService.signup and navigate to /login on successful submission', () => {
      component.signupForm.setValue(validSignupData);
      component.onSubmit();
      expect(authService.signup).toHaveBeenCalledWith(validSignupData);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
    
it('should set loading to true during submission and false after completion (success)', fakeAsync(() => {
        const signupSubject = new Subject();
        (authService.signup as jasmine.Spy).and.returnValue(signupSubject.asObservable());
        
        component.signupForm.setValue(validSignupData);
        component.onSubmit();
        
        // Check initial state
        expect(component.loading).toBe(true);
        
        // 1. Emit the success value
        signupSubject.next({ message: 'Success' });
        // 2. COMPLETE the observable stream to trigger finalize
        signupSubject.complete(); 
        
        // 3. Use tick() to process the microtask queue
        tick(); 
        
        // This assertion will now pass
        expect(component.loading).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      }));

    it('should set loading to true during submission and false after completion (error)', fakeAsync(() => {
        const signupSubject = new Subject();
        (authService.signup as jasmine.Spy).and.returnValue(signupSubject.asObservable());
        
        component.signupForm.setValue(validSignupData);
        component.onSubmit();
        
        expect(component.loading).toBe(true);
        
        // .error() automatically terminates the stream, so no .complete() is needed here
        signupSubject.error({ error: { message: 'Failed' } });
        
        tick(); 
        
        expect(component.loading).toBe(false);
        expect(router.navigate).not.toHaveBeenCalled();
      }));
  });
});