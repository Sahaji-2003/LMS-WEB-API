// const mongoose = require('mongoose');

// const optionSchema = new mongoose.Schema({
//   text: String,
//   isCorrect: Boolean,
// });

// const questionSchema = new mongoose.Schema({
//   text: String,
//   type: String,
//   options: [optionSchema],
//   correctAnswer: String, // For true/false type
// });

// const paperSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   questions: [questionSchema],
// });

// module.exports = mongoose.model('Paper', paperSchema);

const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
  text: String,
  type: String,
  options: [optionSchema],
  correctAnswer: String, // For true/false type
});

const paperSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [questionSchema],
  user_id: {
    type: String,
    ref: 'Educator', // Reference to the Educator model
    required: true,
  },
  current_time: {
    type: Date,
    default: Date.now,
  },
  assigned: {
    type: Boolean,
    default: false,
  },
  marks: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0, // duration in minutes
  },
  classroom: {
    type: String,
    default: '',
  }
});

const Paper = mongoose.model('Paper', paperSchema);

module.exports = Paper;
