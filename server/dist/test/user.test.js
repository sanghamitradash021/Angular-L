"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const userController_1 = __importDefault(require("../controllers/userController"));
const userService_1 = __importDefault(require("../service/userService")); // Import the actual service
// Provide a manual mock factory for the userService module.
// This ensures that all exported functions are replaced with vi.fn() spies.
vitest_1.vi.mock('../service/userService', () => ({
    default: {
        register: vitest_1.vi.fn(),
        login: vitest_1.vi.fn(),
        getProfile: vitest_1.vi.fn(),
        deleteUser: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)('User Controller', () => {
    let req;
    let res;
    let status;
    let json;
    // Cast the imported service to its mocked version for type safety.
    const mockedUserService = userService_1.default;
    (0, vitest_1.beforeEach)(() => {
        json = vitest_1.vi.fn();
        status = vitest_1.vi.fn(() => ({ json }));
        req = {
            body: {},
            params: {},
        };
        res = {
            status,
            json,
        };
        // Reset mocks before each test to ensure isolation
        vitest_1.vi.clearAllMocks();
    });
    // Test for user registration
    (0, vitest_1.describe)('register', () => {
        const fullUserData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            fullname: 'Test User',
            role: 'user',
        };
        (0, vitest_1.it)('should create a new user and return a success message', async () => {
            req.body = fullUserData;
            // This will now work because mockedUserService.register is a vi.fn()
            mockedUserService.register.mockResolvedValue({ user_id: 1 });
            await userController_1.default.register(req, res);
            (0, vitest_1.expect)(mockedUserService.register).toHaveBeenCalledWith(req.body);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(201);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith({ message: 'Profile created successfully' });
        });
        (0, vitest_1.it)('should return 400 if user already exists', async () => {
            req.body = fullUserData;
            const error = new Error('User already exists');
            mockedUserService.register.mockRejectedValue(error);
            await userController_1.default.register(req, res);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(400);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: 'User already exists' }));
        });
        (0, vitest_1.it)('should return 500 on a generic registration error', async () => {
            req.body = fullUserData;
            const error = new Error('Database error');
            mockedUserService.register.mockRejectedValue(error);
            await userController_1.default.register(req, res);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(500);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: 'Database error', error }));
        });
    });
    // Test for user login
    (0, vitest_1.describe)('login', () => {
        (0, vitest_1.it)('should log in a user and return a token', async () => {
            const loginResult = {
                user: { id: 1, username: 'testuser', email: 'test@example.com', fullname: 'Test User' },
                token: 'mock.token',
            };
            req.body = { email: 'test@example.com', password: 'password123' };
            mockedUserService.login.mockResolvedValue(loginResult);
            await userController_1.default.login(req, res);
            (0, vitest_1.expect)(mockedUserService.login).toHaveBeenCalledWith('test@example.com', 'password123');
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(loginResult);
        });
        (0, vitest_1.it)('should return 400 for invalid credentials', async () => {
            req.body = { email: 'test@example.com', password: 'wrongpassword' };
            const error = new Error('Invalid credentials');
            mockedUserService.login.mockRejectedValue(error);
            await userController_1.default.login(req, res);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(400);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: 'Invalid credentials' }));
        });
    });
    // Test for getting a user profile
    (0, vitest_1.describe)('getProfile', () => {
        (0, vitest_1.it)('should return a user profile', async () => {
            const user = { user_id: 1, username: 'testuser' };
            req.params = { id: '1' };
            mockedUserService.getProfile.mockResolvedValue(user);
            await userController_1.default.getProfile(req, res);
            (0, vitest_1.expect)(mockedUserService.getProfile).toHaveBeenCalledWith(1);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(user);
        });
        (0, vitest_1.it)('should return 404 if user not found', async () => {
            req.params = { id: '99' };
            const error = new Error('User not found');
            mockedUserService.getProfile.mockRejectedValue(error);
            await userController_1.default.getProfile(req, res);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(404);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: 'User not found' }));
        });
    });
    // Test for deleting a user
    (0, vitest_1.describe)('deleteUser', () => {
        (0, vitest_1.it)('should delete a user and return a success message', async () => {
            req.params = { id: '1' };
            mockedUserService.deleteUser.mockResolvedValue(true);
            await userController_1.default.deleteUser(req, res);
            (0, vitest_1.expect)(mockedUserService.deleteUser).toHaveBeenCalledWith(1);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
        });
        (0, vitest_1.it)('should return 500 if user deletion fails', async () => {
            req.params = { id: '1' };
            const error = new Error('Failed to delete user');
            mockedUserService.deleteUser.mockRejectedValue(error);
            await userController_1.default.deleteUser(req, res);
            (0, vitest_1.expect)(status).toHaveBeenCalledWith(500);
            (0, vitest_1.expect)(json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: 'Failed to delete user' }));
        });
    });
});
