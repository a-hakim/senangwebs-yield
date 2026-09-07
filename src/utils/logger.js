/**
 * Logger Utility for SWY
 * Provides logging and error reporting functionality
 */

const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  constructor(debugMode = false) {
    this.debugMode = debugMode;
    this.prefix = '[SWY]';
  }

  setDebugMode(enabled) {
    this.debugMode = enabled;
  }

  error(message, error = null) {
    if (error) {
      console.error(`${this.prefix} ERROR: ${message}`, error);
    } else {
      console.error(`${this.prefix} ERROR: ${message}`);
    }
  }

  warn(message) {
    console.warn(`${this.prefix} WARN: ${message}`);
  }

  info(message) {
    if (this.debugMode) {
      console.info(`${this.prefix} INFO: ${message}`);
    }
  }

  debug(message, data = null) {
    if (this.debugMode) {
      if (data) {
        console.log(`${this.prefix} DEBUG: ${message}`, data);
      } else {
        console.log(`${this.prefix} DEBUG: ${message}`);
      }
    }
  }
}

// Export singleton instance
const logger = new Logger(false);

export default logger;
export { Logger, LogLevel };
