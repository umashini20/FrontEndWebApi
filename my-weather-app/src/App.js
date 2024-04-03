// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate
import LoginPage from './LoginPage';
import MapPage from './MapPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Use Navigate instead of Redirect */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<PrivateRoute />} /> {/* Use PrivateRoute directly */}
      </Routes>
    </Router>
  );
}

const PrivateRoute = () => {
  return isAuthenticated() ? <MapPage /> : <Navigate to="/login" />;
};

function isAuthenticated() {
  return !!localStorage.getItem('accessToken');
}

export default App;
