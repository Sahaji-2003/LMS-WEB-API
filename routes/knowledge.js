const express = require('express');
const Knowledgebase = require('../models/knowledgbase.model');  // The MongoDB model
const router = express.Router();

// POST /api/save-knowledge
router.post('/save-knowledge', async (req, res) => {
  const { user_id, knowledge_name, unique_knowledge_id, summary, documents } = req.body;

  // Basic validation to ensure all required fields are present
  if (!user_id || !knowledge_name || !unique_knowledge_id || !documents) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Check if the user has an existing knowledge base
    let userKnowledgebase = await Knowledgebase.findOne({ user_id });

    if (!userKnowledgebase) {
      // If no knowledge base exists, create a new one
      userKnowledgebase = new Knowledgebase({
        user_id,
        knowledgebase: [] // Initialize with an empty array
      });
    }

    // Check if the knowledge entry already exists by unique_knowledge_id
    const existingKnowledge = userKnowledgebase.knowledgebase.find(kb => kb.unique_knowledge_id === unique_knowledge_id);

    if (existingKnowledge) {
      return res.status(400).json({ message: 'Knowledge entry already exists.' });
    }

    // Add the new knowledge entry to the user's knowledge base
    userKnowledgebase.knowledgebase.push({
      knowledge_name,
      unique_knowledge_id,
      summary,
      documents,  // Save the document names here (ensure it’s an array of strings)
    });

    // Save the knowledge base to the database
    await userKnowledgebase.save();

    // Success response
    return res.status(200).json({ message: 'Knowledge saved successfully!' });
  } catch (error) {
    console.error('Error saving knowledge:', error.message || error);
    return res.status(500).json({ message: 'Error saving knowledge to database.' });
  }
});


// Route to get all knowledgebase entries for a specific user
router.get('/get-knowledgebase/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const userKnowledgebase = await Knowledgebase.findOne({ user_id });

    if (!userKnowledgebase) {
      return res.status(200).json([]);
      // return res.status(404).json({ message: 'No knowledge base found for this user.' });
    }

    res.status(200).json(userKnowledgebase.knowledgebase);
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    res.status(500).json({ message: 'Error fetching knowledge base.' });
  }
});


// Add this new route in your existing backend code

// DELETE /api/knowledge/delete-knowledge/:user_id/:unique_knowledge_id
router.delete('/delete-knowledge/:user_id/:unique_knowledge_id', async (req, res) => {
  const { user_id, unique_knowledge_id } = req.params;

  try {
    // Find the user's knowledge base
    const userKnowledgebase = await Knowledgebase.findOne({ user_id });

    if (!userKnowledgebase) {
      return res.status(404).json({ message: 'No knowledge base found for this user.' });
    }

    // Filter out the knowledge entry that matches the unique knowledge ID
    userKnowledgebase.knowledgebase = userKnowledgebase.knowledgebase.filter(
      (kb) => kb.unique_knowledge_id !== unique_knowledge_id
    );

    // Save the updated knowledge base
    await userKnowledgebase.save();

    return res.status(200).json({ message: 'Knowledge entry deleted successfully!' });
  } catch (error) {
    console.error('Error deleting knowledge entry:', error);
    return res.status(500).json({ message: 'Error deleting knowledge entry from database.' });
  }
});







router.get("/test", async (req, res) => {
  try {
    res.status(200).json({ message: "Route is working!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error });
  }
});

module.exports = router;
