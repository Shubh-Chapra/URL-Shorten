const express = require('express');
const router = express.Router();
const User = require('../models/User');
const redisClient = require('../config/redisClient');

// Initialize test data
router.get('/init', async (req, res) => {
  try {
    const user = new User({ name: 'Shadow', email: 'Shadow123@example.com' });
    await user.save();
    await redisClient.set('test-key', 'Hello from Redis');
    res.send('Initialized test data');
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize test data', details: error.message });
  }
});

// Fetch test data
router.get('/fetch', async (req, res) => {
  try {
    const mongoData = await User.findOne();
    const redisData = await redisClient.get('test-key');
    res.json({ mongoData, redisData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test data', details: error.message });
  }
});

module.exports = router;
