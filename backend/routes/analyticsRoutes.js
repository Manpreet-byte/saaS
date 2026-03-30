const express = require('express');
const {
  averageRating,
  reviewsOverTime,
  funnel
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/average-rating', averageRating);
router.get('/reviews-over-time', reviewsOverTime);
router.get('/funnel', funnel);

module.exports = router;
