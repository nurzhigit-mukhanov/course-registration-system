const Course = require("../models/Course");
const User = require("../models/User");

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.enroll = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    // Find the course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the student is already enrolled
    if (course.enrolledStudents.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course" });
    }

    // Check if enrollment slots are full
    if (course.enrolledStudents.length >= course.maxEnrollments) {
      return res
        .status(400)
        .json({ message: "Enrollment full. Added to the waitlist" });
    }

    // Enroll the student
    course.enrolledStudents.push(userId);
    await course.save();

    res.json({ message: "Enrollment successful" });
  } catch (error) {
    console.error("Enrollment error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  const { courseId } = req.params;

  try {
    // Find the course and populate enrolled students
    const course = await Course.findById(courseId).populate(
      "enrolledStudents",
      "name email"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course.enrolledStudents); // Send the list of enrolled students
  } catch (error) {
    console.error("Error fetching enrolled students:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  const userId = req.user.id; // Get the logged-in user's ID

  try {
    // Find courses where the student is enrolled
    const enrolledCourses = await Course.find({ enrolledStudents: userId });
    res.json(enrolledCourses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error.message);
    res.status(500).json({ error: error.message });
  }
};
