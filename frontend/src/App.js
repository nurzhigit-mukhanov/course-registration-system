import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [authToken, setAuthToken] = useState(null);

  return (
    <Router>
      <nav>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route
          path="/dashboard"
          element={<Dashboard authToken={authToken} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
