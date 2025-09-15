import { describe, it, expect, vi, beforeEach, Mock , Mocked} from 'vitest';
import { Request, Response } from 'express';
import userController from '../controllers/userController';
import userService from '../service/userService'; // Import the actual service

// Provide a manual mock factory for the userService module.
// This ensures that all exported functions are replaced with vi.fn() spies.
vi.mock('../service/userService', () => ({
  default: {
    register: vi.fn(),
    login: vi.fn(),
    getProfile: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let status: Mock;
  let json: Mock;

  // Cast the imported service to its mocked version for type safety.
  const mockedUserService = userService as Mocked<typeof userService>;

  beforeEach(() => {
    json = vi.fn();
    status = vi.fn(() => ({ json }));
    req = {
      body: {},
      params: {},
    };
    res = {
      status,
      json,
    };
    // Reset mocks before each test to ensure isolation
    vi.clearAllMocks();
  });

  // Test for user registration
  describe('register', () => {
    const fullUserData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullname: 'Test User',
      role: 'user',
    };

    it('should create a new user and return a success message', async () => {
      req.body = fullUserData;
      // This will now work because mockedUserService.register is a vi.fn()
      mockedUserService.register.mockResolvedValue({ user_id: 1 } as any);

      await userController.register(req as Request, res as Response);

      expect(mockedUserService.register).toHaveBeenCalledWith(req.body);
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith({ message: 'Profile created successfully' });
    });

    it('should return 400 if user already exists', async () => {
      req.body = fullUserData;
      const error = new Error('User already exists');
      mockedUserService.register.mockRejectedValue(error);

      await userController.register(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User already exists' }));
    });

    it('should return 500 on a generic registration error', async () => {
      req.body = fullUserData;
      const error = new Error('Database error');
      mockedUserService.register.mockRejectedValue(error);

      await userController.register(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Database error', error }));
    });
  });

  // Test for user login
  describe('login', () => {
    it('should log in a user and return a token', async () => {
      const loginResult = {
        user: { id: 1, username: 'testuser', email: 'test@example.com', fullname: 'Test User' },
        token: 'mock.token',
      };
      req.body = { email: 'test@example.com', password: 'password123' };
      mockedUserService.login.mockResolvedValue(loginResult);

      await userController.login(req as Request, res as Response);

      expect(mockedUserService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(json).toHaveBeenCalledWith(loginResult);
    });

    it('should return 400 for invalid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      const error = new Error('Invalid credentials');
      mockedUserService.login.mockRejectedValue(error);

      await userController.login(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid credentials' }));
    });
  });

  // Test for getting a user profile
  describe('getProfile', () => {
    it('should return a user profile', async () => {
      const user = { user_id: 1, username: 'testuser' };
      req.params = { id: '1' };
      mockedUserService.getProfile.mockResolvedValue(user as any);

      await userController.getProfile(req as Request, res as Response);

      expect(mockedUserService.getProfile).toHaveBeenCalledWith(1);
      expect(json).toHaveBeenCalledWith(user);
    });

    it('should return 404 if user not found', async () => {
      req.params = { id: '99' };
      const error = new Error('User not found');
      mockedUserService.getProfile.mockRejectedValue(error);

      await userController.getProfile(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User not found' }));
    });
  });

  // Test for deleting a user
  describe('deleteUser', () => {
    it('should delete a user and return a success message', async () => {
      req.params = { id: '1' };
      mockedUserService.deleteUser.mockResolvedValue(true);

      await userController.deleteUser(req as Request, res as Response);

      expect(mockedUserService.deleteUser).toHaveBeenCalledWith(1);
      expect(json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 500 if user deletion fails', async () => {
      req.params = { id: '1' };
      const error = new Error('Failed to delete user');
      mockedUserService.deleteUser.mockRejectedValue(error);

      await userController.deleteUser(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to delete user' }));
    });
  });
});