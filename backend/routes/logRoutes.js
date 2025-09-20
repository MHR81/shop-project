const express = require('express');
const router = express.Router();
const { createLog, getLogs } = require('../controllers/logController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createLog);
router.get('/', protect, admin, getLogs);

module.exports = router;
