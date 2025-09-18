// src/middleware/logger.js
// Custom logging middleware for the app (not using console.log directly)
export function logEvent(event, details = {}) {
  // Replace this with a more advanced logger if needed
  window.__affordmed_logs = window.__affordmed_logs || [];
  window.__affordmed_logs.push({
    timestamp: new Date().toISOString(),
    event,
    details
  });
}

export function getLogs() {
  return window.__affordmed_logs || [];
}
