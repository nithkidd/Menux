/**
 * Security Headers Middleware
 * 
 * Adds essential security headers to protect against common web vulnerabilities.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Security headers middleware
 * Protects against XSS, clickjacking, MIME sniffing, and other attacks.
 */
export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // XSS filter (legacy, but still useful for older browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy - don't leak referrer to other origins
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HTTP Strict Transport Security (HSTS)
  // Enforce HTTPS for 1 year, include subdomains - Applied globally
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Content Security Policy - Protection for API
  // We strictly disable object-src and base-uri.
  // We allow unsafe-inline for styles mainly for Swagger UI compatibility if needed, 
  // but scripts are restricted to 'self'. 
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https://*.supabase.co; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
  );
  
  // CORS is handled by cors middleware, but Helmet sets Cross-Origin-Resource-Policy to same-origin by default
  // We need to allow cross-origin for frontend to access backend resources
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  // Permissions Policy - disable unnecessary browser features
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );

  next();
};

/**
 * Remove X-Powered-By header to hide Express
 */
export const hidePoweredBy = (_req: Request, res: Response, next: NextFunction) => {
  res.removeHeader('X-Powered-By');
  next();
};

/**
 * Combined security middleware
 */
export const securityMiddleware = [hidePoweredBy, securityHeaders];
