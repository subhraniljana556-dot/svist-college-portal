// ================================================================
// CENTRALIZED API CLIENT — Zero-Downtime Deployment Resilient
// ================================================================
// This module centralizes all API communication for the SVIST portal.
//
// WHY THIS EXISTS:
// 1. The API base URL was hardcoded 30+ times across App.jsx.
//    Changing the Render URL required editing every single fetch call.
// 2. When Vercel deploys the frontend before Render finishes deploying
//    the backend, all API calls fail silently (white screen).
//    This wrapper detects that scenario and returns a structured error.
// 3. Render's free tier spins down after 15 minutes of inactivity.
//    The first request can take 30-50 seconds. AbortController with
//    a generous timeout prevents the UI from hanging indefinitely.
//
// USAGE:
//   import { apiFetch, API_BASE } from "../config/api";
//   const { data, error } = await apiFetch("/api/students");
//   if (error) { /* handle gracefully */ }
// ================================================================

// Read from Vite's build-time environment variable.
// Fallback to the current Render URL if VITE_API_URL is not set.
// This fallback ensures the app works without env vars during local dev.
export const API_BASE =
  import.meta.env.VITE_API_URL || "https://svist-college-portal.onrender.com";

/**
 * apiFetch — Resilient fetch wrapper for the SVIST API.
 *
 * @param {string} endpoint - The API path (e.g., "/api/students")
 * @param {object} options - Standard fetch options (method, headers, body)
 * @param {number} timeoutMs - Request timeout in milliseconds (default: 15000)
 *
 * @returns {Promise<{data: any, error: string|null, isOffline: boolean}>}
 *
 * DESIGN DECISIONS:
 * - Returns { data, error, isOffline } instead of throwing.
 *   This means the calling component NEVER crashes from a network error.
 *   It just checks `if (error)` and shows a user-friendly message.
 *
 * - AbortController timeout (15s default):
 *   Render's free tier cold-start can take 30-50s, but we use 15s because:
 *   (a) If the backend is warm, responses are <500ms. 15s is generous.
 *   (b) If the backend is cold-starting, the health check will handle it.
 *   (c) Users won't wait more than 15s — they'll refresh or leave.
 *
 * - HTTP 502/503 detection:
 *   When Render is restarting or deploying, it returns 502/503.
 *   We detect this and set a specific error message so the UI can
 *   show "Server is waking up..." instead of a generic error.
 */
export async function apiFetch(endpoint, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    // Render returns 502/503 during deploys and cold starts
    if (response.status === 502 || response.status === 503) {
      return {
        data: null,
        error: "Server is waking up. Please wait a moment and try again.",
        isOffline: true,
      };
    }

    // Rate limited
    if (response.status === 429) {
      const errorData = await response.json().catch(() => ({}));
      return {
        data: null,
        error: errorData.error || "Too many requests. Please slow down.",
        isOffline: false,
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.error || `Request failed with status ${response.status}`,
        isOffline: false,
      };
    }

    return { data, error: null, isOffline: false };
  } catch (err) {
    clearTimeout(timeoutId);

    // AbortController timeout
    if (err.name === "AbortError") {
      return {
        data: null,
        error: "Request timed out. The server may be starting up.",
        isOffline: true,
      };
    }

    // Network failure (no internet, DNS failure, CORS block)
    return {
      data: null,
      error: "Network error. Please check your connection.",
      isOffline: true,
    };
  }
}
