import { Router } from "express";
import { QuoteService } from "../services/quotes.service.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const q = await QuoteService.quoteRandom();
    res.json(q);
  } catch (err) {
    next(err);
  }
});

router.get("/random-tag", async (req, res, next) => {
  try {
    const q = await QuoteService.quoteFromRandomTag();
    res.json(q);
  } catch (err) {
    next(err);
  }
});

export default router;
