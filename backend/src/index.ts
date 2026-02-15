import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./shared/middleware/error.middleware.js";
import { securityMiddleware } from "./shared/middleware/security.middleware.js";
import morgan from "morgan";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware (must be first)
app.use(securityMiddleware);

// Trust reverse proxy to use real client IPs for rate limiting
app.set("trust proxy", 1);

// Rate limiting
import { apiLimiter } from "./shared/middleware/rateLimit.middleware.js";
app.use("/api", apiLimiter);

// CORS allowlist: supports single FRONTEND_URL or comma-separated CORS_ORIGINS/FRONTEND_URLS
const rawOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGINS,
  process.env.FRONTEND_URLS,
]
  .filter(Boolean)
  .flatMap((value) => (value ? value.split(",") : []))
  .map((value) => value.trim())
  .filter(Boolean);

const defaultOrigins = ["http://localhost:5173"];
const originCandidates = rawOrigins.length > 0 ? rawOrigins : defaultOrigins;

const allowedOrigins = new Set(
  originCandidates
    .map((value) => {
      try {
        return new URL(value).origin;
      } catch {
        return null;
      }
    })
    .filter((value): value is string => Boolean(value)),
);

console.log(`🔒 CORS origins: ${Array.from(allowedOrigins).join(", ")}`);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 204,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api/v1", routes);

// Swagger Documentation
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MenuBuilder API running on http://localhost:${PORT}`);
  console.log(`📖 Health check: http://localhost:${PORT}/api/v1/health`);
});

export default app;
