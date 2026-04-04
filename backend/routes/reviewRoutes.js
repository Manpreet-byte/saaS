import express from "express";
import { createReview, getReview, triggerGenerate, generateReply } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/reviews", createReview);
router.get("/reviews/:id", getReview);
router.post("/reviews/:id/generate", triggerGenerate);
router.post("/reviews/:id/reply", generateReply);

export default router;
