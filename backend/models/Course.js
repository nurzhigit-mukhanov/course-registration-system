// models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  maxEnrollments: { type: Number, required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  schedule: [
    {
      day: { type: String, required: true }, // e.g., 'Monday'
      start: { type: String, required: true }, // e.g., '10:00'
      end: { type: String, required: true }, // e.g., '11:30'
    },
  ],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array to hold enrolled students
  waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array to hold waitlisted students
});

module.exports = mongoose.model("Course", courseSchema);
