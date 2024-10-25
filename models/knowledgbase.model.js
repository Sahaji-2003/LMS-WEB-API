const mongoose = require('mongoose');

// Define schema for individual knowledge entries
const KnowledgeSchema = new mongoose.Schema({
    knowledge_name: { type: String, required: true },
    unique_knowledge_id: { type: String, required: true, unique: true },
    documents: {type: [String]},
    summary: { type: String },
});

// Define schema for the user's knowledge base
const KnowledgebaseSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },  // User has a unique knowledge base
    knowledgebase: { type: [KnowledgeSchema], default: [] }  // Array of knowledge entries
});

// Define model for Knowledgebase
const Knowledgebase = mongoose.model('Knowledgebase', KnowledgebaseSchema);

module.exports = Knowledgebase;
