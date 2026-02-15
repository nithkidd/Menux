/**
 * Security Headers Middleware
 *
 * Adds essential security headers to protect against common web vulnerabilities using Helmet.
 */

import helmet from 'helmet';

/**
 * Helmet security middleware
 * Automatically sets various HTTP headers to secure the app.
 */
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline needed for some UI libraries/tools
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      fontSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.supabase.co"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin for frontend to access backend resources
});

