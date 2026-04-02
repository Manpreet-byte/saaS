import Review from "../models/reviewModel.js";
import reviewQueue from "../queues/reviewQueue.js";
import aiService from "../services/aiService.js";

// Create review and enqueue AI generation job
export async function createReview(req, res, next) {
  try {
    const { userId, rating, notes, tone } = req.body;
    if (!rating) return res.status(400).json({ error: "rating is required" });
    const resolvedTone = tone || (rating <= 2 ? "apologetic" : rating === 3 ? "professional" : "friendly");

    const review = await Review.create({ userId, rating, notes, tone: resolvedTone, status: "pending" });

    // push to queue for async generation
    reviewQueue.push({ reviewId: review._id.toString() });

    return res.status(201).json({ data: review });
  } catch (err) {
    return next(err);
  }
}

export async function getReview(req, res, next) {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    return res.json({ data: review });
  } catch (err) {
    return next(err);
  }
}

export async function triggerGenerate(req, res, next) {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    review.status = "pending";
    await review.save();

    reviewQueue.push({ reviewId: review._id.toString() });
    return res.json({ message: "Generation queued" });
  } catch (err) {
    return next(err);
  }
}

export async function generateReply(req, res, next) {
  try {
    const { id } = req.params;
    const { override } = req.body || {};
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    // Use AI service to generate reply
    const reply = await aiService.generateReply({ rating: review.rating, reviewText: review.aiGeneratedReview || review.notes || "" });
    review.aiSuggestedReply = override ? override : reply;
    await review.save();

    return res.json({ data: review });
  } catch (err) {
    return next(err);
  }
}
