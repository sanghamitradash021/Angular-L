import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { effect, runInInjectionContext, Injector } from '@angular/core'; // Import runInInjectionContext and Injector

import { AuthService } from './auth-service';
import { User, AuthResponse, DecodedToken } from '../models/interface/user.interface';

// Helper to create a mock JWT for testing
const createMockToken = (payload: Partial<DecodedToken>): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
};

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let router: Router;
  let mockSessionStorage: { [key: string]: string };
  let injector: Injector; // To provide injection context for effect()

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    mockSessionStorage = {};
    spyOn(sessionStorage, 'getItem').and.callFake((key: string): string | null => mockSessionStorage[key] || null);
    spyOn(sessionStorage, 'setItem').and.callFake((key: string, value: string): void => { mockSessionStorage[key] = value; });
    spyOn(sessionStorage, 'removeItem').and.callFake((key: string): void => { delete mockSessionStorage[key]; });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    injector = TestBed.inject(Injector); // Get the injector
    
    // Create the service instance here, so it's fresh for each test
    service = TestBed.inject(AuthService); 
  });

  afterEach(() => {
    httpTestingController.verify();
    // No need to clear mockSessionStorage here as it's reset in beforeEach
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with currentUser as null if sessionStorage is empty', () => {
      // This is implicitly tested by the main `beforeEach`
      expect(service.currentUser()).toBeNull();
    });

    // --- FIX: RESTRUCTURE THE CONSTRUCTOR TEST ---
    it('should initialize with currentUser from sessionStorage if a user exists', () => {
        const mockUser: User = { id: 1, username: 'testuser', email: 'test@test.com', fullname: '' };
        sessionStorage.setItem('user', JSON.stringify(mockUser)); // Use the spy to set the value
        
        // Destroy the current TestBed to clear cached services
        TestBed.resetTestingModule();

        // Reconfigure the test bed for this specific test
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
              AuthService,
              { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
            ],
          });
        
        // Inject a completely new instance of the service
        const newService = TestBed.inject(AuthService);
        
        expect(newService.currentUser()).toEqual(mockUser);
      });
  });

  describe('login', () => {
    // --- FIX: REMOVE effect() AND TEST THE FINAL STATE ---
    it('should send a POST request and update state on successful login', () => {
        const credentials = { email: 'test@test.com', password: 'password' };
        const mockUser: User = { id: 1, username: 'testuser', email: 'test@test.com', fullname: '' };
        const mockResponse: AuthResponse = { token: 'mock.token.123', user: mockUser };
        
        service.login(credentials).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpTestingController.expectOne('http://localhost:3000/api/users/login');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        // After the request is flushed, check the final state of the signal and sessionStorage
        expect(service.currentUser()).toEqual(mockUser);
        expect(sessionStorage.getItem('token')).toBe('mock.token.123');
        expect(sessionStorage.getItem('user')).toBe(JSON.stringify(mockUser));
      });
  });

  // No changes needed for the rest of the tests, they were correct.
  describe('signup', () => {
    it('should send a POST request with user info', () => {
        const userInfo = { fullname: 'New User', email: 'new@test.com', password: 'password' };
        service.signup(userInfo).subscribe();
        const req = httpTestingController.expectOne('http://localhost:3000/api/users/register');
        expect(req.request.method).toBe('POST');
        req.flush({ message: 'Success' });
      });
  });

  describe('logout', () => {
    it('should clear session storage, nullify currentUser, and navigate to login', () => {
        service.currentUser.set({ id: 1, username: 'testuser', email: 'test@test.com', fullname: '' });
        sessionStorage.setItem('token', 'some-token');
        
        service.logout();

        expect(sessionStorage.getItem('token')).toBeNull();
        expect(service.currentUser()).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      });
  });

  describe('isAuthenticated', () => {
    it('should return true if the token is valid and not expired', () => {
        const validToken = createMockToken({ exp: Math.floor(Date.now() / 1000) + 3600 });
        sessionStorage.setItem('token', validToken);
        expect(service.isAuthenticated()).toBe(true);
      });
  });

  describe('getUserId', () => {
    it('should return the user ID if a user is in session storage', () => {
        const mockUser: User = { id: 123, username: 'testuser', email: 'test@test.com', fullname: '' };
        sessionStorage.setItem('user', JSON.stringify(mockUser));
        expect(service.getUserId()).toBe(123);
      });
  });
});