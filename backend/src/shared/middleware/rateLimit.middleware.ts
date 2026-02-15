import rateLimit from "express-rate-limit";

// Strict limiter for authentication routes (login, signup, etc.)
// 5 requests per 15 minutes to prevent brute-force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error:
      "Too many login attempts from this IP, please try again after 15 minutes",
  },
});

// General limiter for other API routes
// 100 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Business creation limiter to mitigate automated bursts
export const businessCreateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 creates per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error:
      "Too many business creation attempts from this IP, please try again later",
  },
});
