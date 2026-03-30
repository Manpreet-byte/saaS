const express = require('express');
const {
  toggleAutoResponse,
  setTone
} = require('../controllers/settingsController');

const router = express.Router();

router.post('/toggle-auto-response', toggleAutoResponse);
router.post('/tone', setTone);

module.exports = router;
