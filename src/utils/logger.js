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
    console.error(`${this.prefix} ERROR: ${message}`, error || '');
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
      console.log(`${this.prefix} DEBUG: ${message}`, data || '');
    }
  }
}

// Export singleton instance
const logger = new Logger(false);

export default logger;
export { Logger, LogLevel };
