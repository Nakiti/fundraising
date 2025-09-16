// Lightweight deep key transformers to avoid extra deps
const isPlainObject = (value) => {
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

const toSnake = (str) => {
  return str
    .replace(/([A-Z])/g, "_$1")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}

const toCamel = (str) => {
  return str.replace(/[_-](\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

const transformKeysDeep = (input, keyTransform) => {
  if (Array.isArray(input)) {
    return input.map((item) => transformKeysDeep(item, keyTransform));
  }
  if (isPlainObject(input)) {
    const result = {};
    for (const [key, value] of Object.entries(input)) {
      const newKey = keyTransform(key);
      result[newKey] = transformKeysDeep(value, keyTransform);
    }
    return result;
  }
  return input;
}

// Augment objects with both original and snake_case keys (deep)
const augmentWithSnakeKeysDeep = (input) => {
  if (Array.isArray(input)) {
    return input.map((item) => augmentWithSnakeKeysDeep(item));
  }
  if (isPlainObject(input)) {
    const result = {};
    for (const [key, value] of Object.entries(input)) {
      const augmentedValue = augmentWithSnakeKeysDeep(value);
      result[key] = augmentedValue;
      const snakeKey = toSnake(key);
      if (snakeKey !== key && !(snakeKey in result)) {
        result[snakeKey] = augmentedValue;
      }
    }
    return result;
  }
  return input;
}

const shouldSkipTransform = (req) => {
  if (req.disableCaseTransform) return true;

  const path = req.path || "";
  const contentType = req.headers["content-type"] || "";

  // Skip Stripe webhooks or any webhook endpoints that require raw body
  if (path.startsWith("/api/stripe/webhook")) return true;

  // Skip multipart/form-data (file uploads)
  if (contentType.includes("multipart/form-data")) return true;

  return false;
}

export const requestCaseTransform = (req, res, next) => {
  if (shouldSkipTransform(req)) return next();

  try {
    if (req.body && (isPlainObject(req.body) || Array.isArray(req.body))) {
      req.body = augmentWithSnakeKeysDeep(req.body);
    }
    if (req.query && isPlainObject(req.query)) {
      req.query = augmentWithSnakeKeysDeep(req.query);
    }
    if (req.params && isPlainObject(req.params)) {
      req.params = augmentWithSnakeKeysDeep(req.params);
    }
  } catch (err) {
    // Fail open: don't block the request if transform fails
  }
  next();
}

export const responseCaseTransform = (req, res, next) => {
  if (shouldSkipTransform(req)) return next();

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    try {
      // Only transform the body payload, preserve status and headers
      const transformed = transformKeysDeep(data, toCamel);
      return originalJson(transformed);
    } catch (err) {
      return originalJson(data);
    }
  };

  next();
}

export const caseTransformMiddleware = [requestCaseTransform, responseCaseTransform];

export default caseTransformMiddleware;


