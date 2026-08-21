// ============================================
// GLOBAL ERROR HANDLER MIDDLEWARE
// ============================================
// This is the final middleware in the Express pipeline.
// Express routes errors here when:
//   1. A route handler throws an uncaught exception
//   2. A route handler calls next(err) explicitly
//   3. An async route handler's promise rejects (Express 5.x)
//
// DESIGN DECISIONS:
// - In production (NODE_ENV=production), we NEVER leak stack traces
//   to the client. The stack is logged server-side only.
// - In development, the full stack is included in the JSON response
//   to accelerate debugging.
// - Mongoose validation errors (e.g., missing required fields) are
//   detected by their `name` property and returned as 400 Bad Request
//   instead of 500 Internal Server Error.
// ============================================

const errorHandler = (err, req, res, _next) => {
  // Log the full error server-side for operational debugging.
  // This goes to Render's log stream and is NOT visible to clients.
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);
  console.error(err.stack);

  // Mongoose validation errors → 400 Bad Request
  // These occur when a document fails schema validation (e.g., missing
  // required field, value out of enum range). They are client errors,
  // not server errors.
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Failed",
      details: err.message,
    });
  }

  // Mongoose duplicate key errors (error code 11000)
  // e.g., attempting to create a student with an existing rollNumber
  if (err.code === 11000) {
    return res.status(409).json({
      error: "Duplicate Entry",
      details: "A record with this identifier already exists.",
    });
  }

  // JWT errors are already handled by the auth middleware, but in case
  // one slips through (e.g., from a new route that forgot the guard):
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Authentication Failed",
      details: err.message,
    });
  }

  // Default: 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  const response = {
    error: err.message || "Internal Server Error",
  };

  // Only include stack trace in development for debugging
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
