import "./config.js";
import express from "express";
import cors from "cors";
import reviewRoutes from "./routes/reviewRoutes.js";
import db from "./db/mongoose.js";
import { errorHandler } from "./utils/errorMiddleware.js";
import { aiLimiter } from "./utils/rateLimiter.js";

const app = express();
app.use(express.json());

// Allow CORS from frontend (configure as needed)
app.use(cors());

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// apply rate limiter to AI endpoints (review generation and reply)
app.use("/api/reviews", aiLimiter);

// api
app.use("/api", reviewRoutes);

// errors
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function start() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) await db.connect(mongoUri);
  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
