import { Request, Response } from 'express';
import userService from '../service/userService';

/** Registers a new user.
 * @param req - The request object containing user details in body.
 * @param res - The response object.
 */

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    await userService.register(req.body);
    res.status(201).json({ message: 'Profile created successfully' });
  } catch (error: any) {
    const statusCode = error.message === 'User already exists' ? 400 : 500;
    res.status(statusCode).json({ message: error.message || 'Error in registering', error });
  }
};

/** Logs in a user.
 * @param req - The request object containing email and password in body.
 * @param res - The response object.
 */

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await userService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (error: any) {
    const statusCode = error.message === 'Invalid credentials' ? 400 : 500;
    res.status(statusCode).json({ message: error.message || 'Error logging in', error });
  }
};

/** Retrieves a user's profile by ID.
 * @param req - The request object containing user ID in params.
 * @param res - The response object.
 */

const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getProfile(Number(req.params.id));
    res.json(user);
  } catch (error: any) {
    const statusCode = error.message === 'User not found' ? 404 : 500;
    res.status(statusCode).json({ message: error.message || 'Error fetching profile', error });
  }
};

/** Updates a user's profile by ID.
 * @param req - The request object containing user ID in params and updated details in body.
 * @param res - The response object.
 */

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    await userService.updateProfile(Number(req.params.id), req.body);
    res.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating profile', error });
  }
};

/** Deletes a user by ID.
 * @param req - The request object containing user ID in params.
 * @param res - The response object.
 */

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await userService.deleteUser(Number(req.params.id));
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting user', error });
  }
};

export default { register, login, getProfile, updateProfile, deleteUser };