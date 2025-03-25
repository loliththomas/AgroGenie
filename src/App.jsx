import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import CropPrediction from '../features/CropPrediction.jsx';
import FertilizerRecommendation from '../features/FertilizerRecommendation.jsx';
import Yield from '../features/Yield.jsx';  
import FertilizerResults from '../features/FertilizerResults.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Login />} />
            <Route path="/prediction" element={<CropPrediction />} />
            <Route path="/fertilizer" element={<FertilizerRecommendation />} />
            <Route path="/yield" element={<Yield />} /> 
            <Route path="/fertilizer-results" element={<FertilizerResults />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;