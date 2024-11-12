// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const register = (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

export const login = (credentials) => {
  return axios.post(`${API_URL}/auth/login`, credentials);
};

export const getCourses = (token) => {
  return axios.get(`${API_URL}/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const enrollInCourse = (courseId, token) => {
  return axios.post(
    `${API_URL}/courses/${courseId}/enroll`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
