const express = require('express');
const router = express.Router();
const Student = require('../models/student.model');
const Educator = require('../models/educator.model');

// Student signup route
router.post('/signup', async (req, res) => {
  const { student_name, institute, standard, user_id, student_phone, student_username, password } = req.body;

  try {
    const userExists = await Student.findOne({ user_id });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const student = await Student.create({
      student_name,
      role: 'Student', // Default value as per schema
      institute,
      standard,
      user_id,
      student_phone,
      student_username,
      password
    });

    res.status(201).json({ message: 'Student registered successfully', success: true });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student login route
router.post('/login', async (req, res) => {
  const { user_id, password } = req.body;

  try {
    const user = await Student.findOne({ user_id });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student by user_id
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const student = await Student.findOne({ user_id });

    if (student) {
      const { student_name, role, institute, student_phone, student_username, standard } = student;
      res.json({ student_name, role, institute, user_id, student_phone, student_username, standard });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/add-educator', async (req, res) => {
  const { userId, email } = req.body;

  try {
    const student = await Student.findOne({ user_id: userId });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Add the educator's email to the student's educators array if it's not already there
    if (!student.educators.includes(email)) {
      student.educators.push(email);
      await student.save();
      return res.status(200).json({ message: 'Educator added successfully' });
    } else {
      return res.status(400).json({ error: 'Educator already added' });
    }
  } catch (error) {
    console.error('Error adding educator:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get student and their educators by user ID (email)
// Get student and their educators by user ID (email)
router.get('/:user_id/educators', async (req, res) => {
  try {
    // Find the student by user ID
    const student = await Student.findOne({ user_id: req.params.user_id });
    if (!student) {
      return res.status(404).send('Student not found');
    }

    // Ensure student.educators is an array and not empty
    if (!Array.isArray(student.educators) || student.educators.length === 0 || student.educators.length === 1) {
      return res.status(404).send('No educators found for this student');
    }

    // Find all educators whose usernames are in the student.educators array
    const educators = await Educator.find({ user_id: { $in: student.educators } });

    // Return the student and educators as a JSON response
    res.json({ educators });
  } catch (error) {
    console.error('Error fetching educators:', error);
    res.status(500).send('Server Error');
  }
});




module.exports = router;
