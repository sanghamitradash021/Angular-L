import winston from 'winston';

// Create the logger instance
const logger = winston.createLogger({
  // The lowest level of messages to log to the console.
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  
  // Define the format for the console logs
  format: winston.format.combine(
    winston.format.colorize(), // Add colors to the output
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add a timestamp
    winston.format.printf(({ timestamp, level, message, stack }) => {
      // If a stack trace exists (from an error), print it. Otherwise, just print the message.
      const logMessage = stack ? stack : message;
      return `[${timestamp}] ${level}: ${logMessage}`;
    }),
  ),

  // Winston will only log to the console.
  transports: [new winston.transports.Console()],
  
  exitOnError: false, // Do not exit on handled exceptions
});

export default logger;