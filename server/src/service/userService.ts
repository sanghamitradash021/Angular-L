import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository';
import User from '../models/user';

class UserService {

    /* Register a new user */
  async register(userData: Partial<User>): Promise<User> {
    const userExists = await userRepository.findByEmail(userData.email!);
    if (userExists) {
      throw new Error('User already exists');
    }

    const newUser = await userRepository.create(userData);
    if (!newUser) {
      throw new Error('Failed to create user');
    }
    return newUser;
  }

  /* User login */

  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    const user = await userRepository.validateCredentials(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    return {
      user: { id: user.user_id, username: user.username, email: user.email, fullname: user.fullname },
      token,
    };
  }

  /* Get user profile by ID */

  async getProfile(id: number): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /* Update user profile by ID */

  async updateProfile(id: number, userData: Partial<User>): Promise<boolean> {
    const success = await userRepository.update(id, userData);
    if (!success) {
      throw new Error('Failed to update profile');
    }
    return true;
  }

  /* Delete a user by ID */

  async deleteUser(id: number): Promise<boolean> {
    const success = await userRepository.delete(id);
    if (!success) {
      throw new Error('Failed to delete user');
    }
    return true;
  }
}

export default new UserService();