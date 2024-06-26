const express = require('express');
const router = express.Router();
const Paper = require('../models/paper.model');

// Save a paper
router.post('/save', async (req, res) => {
    console.log('Received paper data:', req.body); // Add this line
    try {
      const paper = new Paper(req.body);
      await paper.save();
      res.status(201).send(paper);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  

// Get all papers
router.get('/', async (req, res) => {
  try {
    const papers = await Paper.find();
    res.send(papers);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get('/:id', async (req, res) => {
    try {
      const paper = await Paper.findById(req.params.id);
      if (!paper) {
        return res.status(404).send({ message: 'Paper not found' });
      }
      res.send(paper);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  router.get('/educator/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
      const papers = await Paper.find({ user_id: userId });
      res.json(papers);
    } catch (error) {
      console.error('Error fetching papers:', error);
      res.status(500).json({ message: 'Server error' });
  }
  });

  router.delete('/educator/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Paper.findByIdAndDelete(id);
      res.status(200).json({ message: 'Paper deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting paper' });
    }
  });

  router.put('/educator/edit/:id', async (req, res) => {
    try {
      const updatedPaper = await Paper.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedPaper) {
        return res.status(404).json({ error: 'Paper not found' });
      }
      res.status(200).json(updatedPaper);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update paper' });
    }
  });

  router.get('/assigned/:user_id/papers', async (req, res) => {
    try {
      const papers = await Paper.find({ user_id: req.params.user_id, assigned: true });
      if (!papers || papers.length === 0) {
        return res.status(404).send('No assigned papers found for this educator');
      }
      res.json(papers);
    } catch (error) {
      console.error('Error fetching papers:', error);
      res.status(500).send('Server Error');
    }
  });
  
  router.patch('/educator/assign/:id', async (req, res) => {
    const { id } = req.params;
    const { assigned, marks, duration, classroom } = req.body;
  
    try {
      const updatedPaper = await Paper.findByIdAndUpdate(id, { assigned, marks, duration, classroom }, { new: true });
      res.status(200).json(updatedPaper);
    } catch (error) {
      console.error('Error updating paper:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


  // router.patch('/educator/assign/:id', async (req, res) => {
  //   const { id } = req.params;
  //   const { assigned, marks, duration } = req.body;
  
  //   try {
  //     const updatedPaper = await Paper.findByIdAndUpdate(id, { assigned, marks, duration }, { new: true });
  //     res.status(200).json(updatedPaper);
  //   } catch (error) {
  //     console.error('Error updating paper:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // });

module.exports = router;
