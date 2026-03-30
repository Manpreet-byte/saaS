const express = require('express');
const {
  createReview,
  getAllReviews
} = require('../controllers/reviewController');

const router = express.Router();

router.post('/', createReview);
router.get('/', getAllReviews);

module.exports = router;
