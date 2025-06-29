const express = require('express');
const router = express.Router();
const Anomaly = require('../models/Anomaly'); // Adjust the path if needed

router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const anomalies = await Anomaly.find({
      createdAt: { $gte: today }
    });

    res.status(200).json(anomalies);
  } catch (err) {
    console.error('Error fetching today’s anomalies:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
