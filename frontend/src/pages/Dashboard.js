// Dashboard.js
import React, { useState, useEffect } from "react";
import { getCourses, enrollInCourse } from "../services/api";
import axios from "axios";
import moment from "moment";
import "./Dashboard.css";

export default function Dashboard({ authToken }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null); // For previewing
  const [enrolledCourses, setEnrolledCourses] = useState([]); // For enrolled courses
  const [message, setMessage] = useState("");

  // Fetch available courses and enrolled courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses(authToken);
        setCourses(response.data);
      } catch (error) {
        setMessage("Failed to load courses");
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/courses/enrolled",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setEnrolledCourses(response.data); // Store enrolled courses in state
      } catch (error) {
        console.error("Failed to load enrolled courses:", error);
      }
    };

    fetchCourses();
    fetchEnrolledCourses(); // Load enrolled courses on component mount
  }, [authToken]);

  // Handle course selection for preview
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  // Handle enrollment with conflict check
  const handleEnroll = async () => {
    if (selectedCourse) {
      // Check for time conflicts with enrolled courses
      const hasConflict = enrolledCourses.some((enrolledCourse) =>
        enrolledCourse.schedule.some((enrolledSlot) =>
          selectedCourse.schedule.some(
            (selectedSlot) =>
              enrolledSlot.day === selectedSlot.day &&
              moment(enrolledSlot.start, "HH:mm").isBefore(
                moment(selectedSlot.end, "HH:mm")
              ) &&
              moment(enrolledSlot.end, "HH:mm").isAfter(
                moment(selectedSlot.start, "HH:mm")
              )
          )
        )
      );

      if (hasConflict) {
        setMessage("Enrollment failed: time conflict with an existing course.");
        return;
      }

      try {
        const response = await enrollInCourse(selectedCourse._id, authToken);
        if (response.data.message === "Enrollment successful") {
          setEnrolledCourses((prev) => [...prev, selectedCourse]); // Add to enrolled courses
          setMessage("Enrolled successfully.");
        } else {
          setMessage(response.data.message);
        }
        setSelectedCourse(null);
      } catch (error) {
        console.error(
          "Enrollment error:",
          error.response?.data || error.message
        );
        setMessage(error.response?.data?.message || "Enrollment failed.");
      }
    }
  };

  // Helper function to determine if a slot is occupied by an enrolled course
  const isSlotOccupied = (day, time) => {
    return enrolledCourses.some((course) =>
      course.schedule.some(
        (slot) =>
          slot.day === day &&
          moment(slot.start, "HH:mm").isSameOrBefore(moment(time, "HH:mm")) &&
          moment(slot.end, "HH:mm").isAfter(moment(time, "HH:mm"))
      )
    );
  };

  // Render the weekly schedule table, including both enrolled courses and previewed course
  const renderScheduleTable = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const times = Array.from({ length: 8 }, (_, i) =>
      moment()
        .startOf("day")
        .add(9 + i, "hours")
        .format("HH:mm")
    );

    return (
      <table className="schedule-table">
        <thead>
          <tr>
            <th></th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time}>
              <td>{time}</td>
              {days.map((day) => {
                // Check if the slot is occupied by an enrolled course
                const isOccupied = isSlotOccupied(day, time);

                // Check if the slot is part of the selected course preview
                const isPreviewSlot =
                  selectedCourse &&
                  selectedCourse.schedule.some(
                    (slot) =>
                      slot.day === day &&
                      moment(slot.start, "HH:mm").isSameOrBefore(
                        moment(time, "HH:mm")
                      ) &&
                      moment(slot.end, "HH:mm").isAfter(moment(time, "HH:mm"))
                  );

                return (
                  <td
                    key={`${day}-${time}`}
                    className={`time-slot ${isOccupied ? "occupied" : ""} ${
                      isPreviewSlot ? "preview" : ""
                    }`}
                  >
                    {isOccupied
                      ? enrolledCourses.find((course) =>
                          course.schedule.some(
                            (slot) =>
                              slot.day === day &&
                              moment(slot.start, "HH:mm").isSameOrBefore(
                                moment(time, "HH:mm")
                              ) &&
                              moment(slot.end, "HH:mm").isAfter(
                                moment(time, "HH:mm")
                              )
                          )
                        )?.title || "Occupied"
                      : isPreviewSlot
                      ? selectedCourse.title
                      : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Available Courses</h2>
        <ul className="course-list">
          {courses.map((course) => (
            <li
              key={course._id}
              onClick={() => handleCourseClick(course)}
              className={selectedCourse === course ? "selected" : ""}
            >
              {course.title}
            </li>
          ))}
        </ul>
        <button onClick={handleEnroll} disabled={!selectedCourse}>
          Enroll in Selected Course
        </button>
        <p>{message}</p>
      </div>
      <div className="schedule">
        <h2>Weekly Schedule</h2>
        {renderScheduleTable()}
      </div>
    </div>
  );
}
