import rateLimit from "express-rate-limit";

export function setupRateLimit(app) {
  const MAX_REQUESTS = process.env.MAX_REQUESTS || 1000;

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: MAX_REQUESTS,
    message: "Too many requests, try again later.",
  });

  app.use(limiter);
}
