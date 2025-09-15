import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Global error handler middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Error:', err.message);

  res.status(500).json({
    message: 'Something went wrong. Please try again later.',
    error: process.env.NODE_ENV === 'design' ? err.message : undefined,
  });
};
