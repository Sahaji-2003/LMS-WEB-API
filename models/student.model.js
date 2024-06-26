// const mongoose = require('mongoose');

// const StudentSchema = new mongoose.Schema({
//     student_name: { type: String, required: true },
//     role: { type: String, required: true, default: "Student"},
//     institute: { type: String, required: true },
//     standard: { type: String },
//     user_id: { type: String, required: true, unique: true },
//     student_phone: { type: Number, required: true },
//     student_username: { type: String, required: true },
//     password: { type: String, required: true }
// });

// const Student = mongoose.model('Student', StudentSchema);

// module.exports = Student;


const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    student_name: { type: String, required: true },
    role: { type: String, required: true, default: "Student" },
    institute: { type: String, required: true },
    standard: { type: String },
    user_id: { type: String, required: true, unique: true },
    student_phone: { type: Number, required: true },
    student_username: { type: String, required: true },
    password: { type: String, required: true },
    educators: { type: [String], default: [] } // Array to store educator emails
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
