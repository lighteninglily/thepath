/**
 * Logging utility
 * Provides structured logging with levels and development/production modes
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  private enabled: boolean;

  constructor() {
    this.enabled = isDevelopment;
  }

  /**
   * Debug level - only in development
   */
  debug(message: string, ...args: any[]) {
    if (!this.enabled) return;
    console.log(`[DEBUG] ${message}`, ...args);
  }

  /**
   * Info level - general information
   */
  info(message: string, ...args: any[]) {
    console.log(`[INFO] ${message}`, ...args);
  }

  /**
   * Warning level - something unexpected but not critical
   */
  warn(message: string, ...args: any[]) {
    console.warn(`[WARN] ${message}`, ...args);
  }

  /**
   * Error level - something went wrong
   */
  error(message: string, error?: Error | unknown, ...args: any[]) {
    console.error(`[ERROR] ${message}`, error, ...args);
  }

  /**
   * Group related logs together
   */
  group(label: string) {
    if (!this.enabled) return;
    console.group(label);
  }

  groupEnd() {
    if (!this.enabled) return;
    console.groupEnd();
  }
}

// Export singleton instance
export const logger = new Logger();
