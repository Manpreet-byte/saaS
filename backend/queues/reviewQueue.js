import Bull from "bull";
import Review from "../models/reviewModel.js";
import aiService from "../services/aiService.js";

// Use Redis-backed Bull queue when REDIS_URL is provided, otherwise fallback to in-memory.
const REDIS_URL = process.env.REDIS_URL;

let bullQueue = null;
if (REDIS_URL) {
  bullQueue = new Bull("review-generation", REDIS_URL);

  // processor
  bullQueue.process(async (job) => {
    const { reviewId } = job.data;
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Review not found");

    review.status = "processing";
    await review.save();

    const aiGeneratedReview = await aiService.generateReview({
      rating: review.rating,
      tone: review.tone,
      notes: review.notes,
    });

    review.aiGeneratedReview = aiGeneratedReview;
    review.status = "completed";
    await review.save();
    return { success: true };
  });
}

// Fallback in-memory queue
class InMemoryQueue {
  constructor() {
    this.jobs = [];
    this.processing = false;
    this.retryLimit = 3;
  }

  push(job) {
    this.jobs.push({ ...job, attempts: 0 });
    this._maybeStart();
  }

  async _processJob(job) {
    const { reviewId } = job;
    try {
      const review = await Review.findById(reviewId);
      if (!review) throw new Error("Review not found");

      review.status = "processing";
      await review.save();

      const aiGeneratedReview = await aiService.generateReview({
        rating: review.rating,
        tone: review.tone,
        notes: review.notes,
      });

      review.aiGeneratedReview = aiGeneratedReview;
      review.status = "completed";
      await review.save();
      return { success: true };
    } catch (err) {
      job.attempts = (job.attempts || 0) + 1;
      if (job.attempts < this.retryLimit) {
        setTimeout(() => this.push(job), 1000 * job.attempts);
      } else {
        try {
          const review = await Review.findById(job.reviewId);
          if (review) {
            review.status = "failed";
            await review.save();
          }
        } catch (e) {
          // ignore
        }
      }
      return { success: false, error: err.message };
    }
  }

  async _maybeStart() {
    if (this.processing) return;
    this.processing = true;
    while (this.jobs.length > 0) {
      const job = this.jobs.shift();
      // eslint-disable-next-line no-await-in-loop
      await this._processJob(job);
    }
    this.processing = false;
  }
}

const inMemoryQueue = new InMemoryQueue();

const reviewQueue = {
  async push(job) {
    if (bullQueue) {
      await bullQueue.add(job);
    } else {
      inMemoryQueue.push(job);
    }
  },
  // for debugging/testing
  async count() {
    if (bullQueue) return bullQueue.count();
    return inMemoryQueue.jobs.length;
  },
};

export default reviewQueue;
