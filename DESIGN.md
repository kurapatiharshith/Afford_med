# AffordMed URL Shortener - Design Document

## Data Modeling & Client Persistence
- All shortened URLs are stored in `sessionStorage` under the key `affordmed_short_urls`.
- Each entry contains: `originalUrl`, `short` (shortcode), `createdAt`, `expiresAt`, `clickCount`, and `clicks` (array of click events).
- Click events include timestamp, source, and location (placeholder).
- No backend or persistent storage is used; all data is session-based for evaluation.

## Technology Selection & Reasoning
- **React**: Modern, component-based UI library for maintainable code.
- **Vite**: Fast build tool for React projects.
- **Material UI**: For accessible, consistent, and modern UI components.
- **React Router**: For client-side routing and short URL redirection.
- **Custom Logging Middleware**: All logs use a custom logger, not `console.log`.

## Error Handling & Validation Strategy
- All user inputs are validated client-side:
  - URL format checked with `URL` constructor.
  - Validity must be a positive integer (default 30 min).
  - Shortcodes must be unique, 4-16 chars, alphanumeric/dash/underscore.
- Errors are shown with user-friendly messages using Material UI `Alert`.
- Shortcode collisions are detected before saving.
- Expired or missing shortcodes show alerts and redirect to home.
- All operational events and errors are logged via the custom logger.

## Assumptions & Constraints
- No backend or persistent storage; all data is lost on session end.
- Geolocation for clicks is a placeholder ("Unknown").
- Short URL redirection opens the original URL in a new tab and logs the click.
- UI strictly follows Material UI guidelines; no non-native libraries used.
- The app is accessible and responsive by default.

---

This document covers the design, technology, and validation approach for the AffordMed frontend assignment. For any backend or persistent storage, further changes would be required.
