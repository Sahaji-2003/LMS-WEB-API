const router = require('express').Router();
const Machines = require('../models/machines.model');
const axios = require('axios');
const { Parser } = require('json2csv');

// Endpoint to fetch machine details and generate CSV report
router.get('/generate_report', async (req, res) => {
  const { user_id, days, machine_id } = req.query; // Expect user_id, days, and optional machine_id as query parameters

  try {
    // Fetch machine IDs for the given user ID
    const machines = await Machines.findOne({ user_id });
    if (!machines) {
      return res.status(404).json({ success: false, message: 'Machines not found for the given user ID' });
    }

    const machineIds = machine_id ? [machine_id] : machines.machine_ids;

    // Fetch data for each machine ID
    const allData = [];
    for (const id of machineIds) {
      const apiUrl = `https://api.thingspeak.com/channels/${id}/feeds.json?api_key=YR2MHT97ZBXYIL4Y&days=${days}`;
      const response = await axios.get(apiUrl);
      const data = response.data.feeds.map(feed => ({
        machine_id: id,
        created_at: feed.created_at,
        field1: feed.field1,
        field2: feed.field2,
        field3: feed.field3,
      }));
      allData.push(...data);
    }

    // Return the data directly for the frontend to handle CSV conversion
    res.json(allData);
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
});

module.exports = router;
