type PlainObject = Record<string, unknown>;

export function sanitize<T extends PlainObject>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const sensitiveKeys = [
    'password',
    'token',
    'authorization',
    'auth',
    'apiKey',
    'secret',
  ];

  const result: PlainObject = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key as keyof T];

    if (sensitiveKeys.includes(key.toLowerCase())) {
      result[key] = '***';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // recursive sanitize
      result[key] = sanitize(value as PlainObject);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
