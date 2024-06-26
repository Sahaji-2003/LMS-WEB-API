// const express = require('express');
// const router = express.Router();
// // const bcrypt = require('bcryptjs');
// const Educator = require('../models/educator.model');

// // router.post('/signup', async (req, res) => {
// //     const { fullName, age, gender, height, weight, user_id, password } = req.body;

// //     try {
// //         const userExists = await User.findOne({ user_id });

// //         if (userExists) {
// //             return res.status(400).json({ message: 'User already exists' });
// //         }

// //         const user = await User.create({
// //             fullName, age, gender, height, weight, user_id, password
// //         });

// //         res.status(201).json({ message: 'User registered successfully' });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server error' });
// //     }
// // });
// router.post('/educator/signup', async (req, res) => {
//     const { fullName, age, gender, height, weight, user_id, password } = req.body;
  
//     try {
//       const userExists = await Educator.findOne({ user_id });
  
//       if (userExists) {
//         return res.status(400).json({ message: 'User already exists' });
//       }
  
//       const user = await User.create({ fullName, age, gender, height, weight, user_id, password });
  
//       res.status(201).json({ message: 'User registered successfully', success: true });
//     } catch (error) {
//       console.error('Error during signup:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
  

// router.post('/login', async (req, res) => {
//     const { user_id, password } = req.body;

//     try {
//         const user = await User.findOne({ user_id });

//         if (!user || user.password !== password) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         res.json({ message: 'Login successful' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

//  // Assuming you have a Customer model

// router.get('/user/:user_id', async (req, res) => {
//     const { user_id } = req.params;

//     try {
//         // Find the customer with the provided user_id
//         const user = await User.findOne({ user_id });

//         if (user) {
//             // If user is found, send user information in response
//             const { fullName, age, gender, height, weight, user_id, password } = user;
//             res.json({ fullName, age, gender, height, weight, user_id, password });
//         } else {
//             // If user is not found, send a 404 error
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         // If an error occurs, send a 500 error
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });




// module.exports = router;


const express = require('express');
const router = express.Router();
const Educator = require('../models/educator.model');

// Educator signup route
router.post('/educator/signup', async (req, res) => {
  const { educator_name, institute, user_id, educator_phone, username, password } = req.body;

  try {
    const userExists = await Educator.findOne({ user_id });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const educator = await Educator.create({
      educator_name,
      role: 'Educator', // Default value as per schema
      institute,
      user_id,
      educator_phone,
      username,
      password
    });

    res.status(201).json({ message: 'User registered successfully', success: true });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Educator login route
router.post('/educator/login', async (req, res) => {
  const { user_id, password } = req.body;

  try {
    const user = await Educator.findOne({ user_id });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get educator by user_id
router.get('/educator/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const educator = await Educator.findOne({ user_id });

    if (educator) {
      const { educator_name, role, institute, user_id, educator_phone, username, password } = educator;
      res.json({ educator_name, role, institute, user_id, educator_phone, username, password });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/educator/email/:email', async (req, res) => {
  try {
      const educator = await Educator.findOne({ user_id: req.params.email });
      if (!educator) {
          return res.status(404).send('Educator not found');
      }
      res.json(educator);
  } catch (error) {
      res.status(500).send('Server Error');
  }
});


router.put('/educator/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { educator_name, institute, role, educator_phone } = req.body;

  try {
    const updatedEducator = await Educator.findOneAndUpdate(
      { user_id },
      {
        educator_name,
        role,
        institute,
        educator_phone,
      },
      { new: true }
    );

    if (!updatedEducator) {
      return res.status(404).send('Educator not found');
    }

    res.json(updatedEducator);
  } catch (error) {
    console.error('Error updating educator:', error);
    res.status(500).send('Server error');
  }
});

router.post('/educator/change-password/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const educator = await Educator.findOne({ user_id });

    if (!educator) {
      return res.status(404).json({ message: 'Educator not found' });
    }

    if (educator.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    educator.password = newPassword;
    await educator.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

