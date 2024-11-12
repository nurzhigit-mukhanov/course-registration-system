// routes/courses.js
const express = require("express");
const {
  getCourses,
  enroll,
  getEnrolledStudents,
  getEnrolledCourses,
} = require("../controllers/courseController"); // Import getEnrolledStudents
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getCourses); // Get all courses
router.post("/:courseId/enroll", authMiddleware, enroll); // Enroll in a course
router.get("/:courseId/students", authMiddleware, getEnrolledStudents); // Get enrolled students
router.get("/enrolled", authMiddleware, getEnrolledCourses); // Get enrolled courses for the logged-in user

module.exports = router;
