import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import Campaigns from './pages/Campaigns.jsx';
import About from './pages/About.jsx';
import Supports from './pages/Supports.jsx'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/about" element={<About />} /> 
           <Route path="/supports" element={<Supports />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;