// ============================================
// AUTH MIDDLEWARE — JWT Verification Guards
// ============================================
// Extracted from monolithic index.js for reusability.
// Each middleware reads the Authorization header, verifies the JWT
// against process.env.JWT_SECRET, and attaches the decoded payload
// to the request object for downstream route handlers.
// ============================================

const jwt = require("jsonwebtoken");

/**
 * verifyMasterKey — Admin authentication guard.
 * Reads the raw JWT from the Authorization header (no "Bearer " prefix
 * in this codebase — matches the frontend's existing fetch calls).
 * On success: attaches decoded token to `req.admin`.
 * On failure: returns 401 (missing) or 400 (invalid/expired).
 */
const verifyMasterKey = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied." });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Key." });
  }
};

/**
 * verifyHODKey — HOD authentication guard.
 * Identical verification logic to verifyMasterKey but attaches
 * the decoded payload to `req.hod` for semantic clarity in route handlers.
 */
const verifyHODKey = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "HOD Access Denied." });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.hod = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid HOD Key." });
  }
};

module.exports = { verifyMasterKey, verifyHODKey };
