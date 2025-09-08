import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import UploadPage from './pages/UploadPage';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Styles
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-organic w-16 h-16 rounded-full"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main App Component
const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slack-gray-50 via-white to-slack-gray-100">
      {/* Organic Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(74,21,75,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(0,122,90,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_80%,rgba(18,100,163,0.1),transparent_50%)]" />
      </div>

      {/* Navigation */}
      {user && <Navbar />}

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id"
              element={
                <ProtectedRoute>
                  <ProjectPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Organic Footer */}
      <footer className="relative z-10 mt-auto py-8 px-6 text-center text-slack-gray-600">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm">
            Crafted with care for Slack teams who value{' '}
            <span className="text-role-designer font-medium">creativity</span>,{' '}
            <span className="text-role-reviewer font-medium">quality</span>,{' '}
            <span className="text-role-pm font-medium">impact</span>, and{' '}
            <span className="text-role-developer font-medium">precision</span>.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-xs">
            <span>DesignSight v1.0</span>
            <span>•</span>
            <span>Built for Slack teams</span>
            <span>•</span>
            <span>Human-centered design</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Root App Component with Auth Provider
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;