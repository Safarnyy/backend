import * as fs from 'fs';
import * as path from 'path';

// Ensure log directory
export const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

export const logPaths = {
  app: path.join(logDir, 'app.log'),
  error: path.join(logDir, 'error.log'),
  http: path.join(logDir, 'http.log'),
};

// Helper to append log lines to files
export function appendLog(file: string, message: string) {
  fs.appendFile(file, message + '\n', (err) => {
    if (err) console.error('Failed to write log file:', err);
  });
}
