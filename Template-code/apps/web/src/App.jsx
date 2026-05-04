import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import ProfessorDashboard from '@/pages/ProfessorDashboard.jsx';
import StudentDashboard from '@/pages/StudentDashboard.jsx';
import GamesPage from '@/pages/GamesPage.jsx';
import ArticlesPage from '@/pages/ArticlesPage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';

import QuizGame from '@/components/games/QuizGame.jsx';
import TypingGame from '@/components/games/TypingGame.jsx';
import FishingGame from '@/components/games/FishingGame.jsx';
import RecyclingGame from '@/components/games/RecyclingGame.jsx';
import ForestBuilderGame from '@/components/games/ForestBuilderGame.jsx';
import EcoChallengeGame from '@/components/games/EcoChallengeGame.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Semi-Protected / Public-ish Routes */}
          <Route path="/articles" element={<ArticlesPage />} />
          
          {/* Protected Professor Routes */}
          <Route path="/professor-dashboard" element={
            <ProtectedRoute allowedRoles={['professor']}>
              <ProfessorDashboard />
            </ProtectedRoute>
          } />

          {/* Protected Student Routes */}
          <Route path="/student-dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/games" element={
            <ProtectedRoute allowedRoles={['student']}>
              <GamesPage />
            </ProtectedRoute>
          } />

          <Route path="/games/recycling" element={
            <ProtectedRoute allowedRoles={['student']}>
              <RecyclingGame />
            </ProtectedRoute>
          } />
          <Route path="/games/fishing" element={
            <ProtectedRoute allowedRoles={['student']}>
              <FishingGame />
            </ProtectedRoute>
          } />
          <Route path="/games/eco-challenge" element={
            <ProtectedRoute allowedRoles={['student']}>
              <ForestBuilderGame />
            </ProtectedRoute>
          } />
          <Route path="/games/quiz" element={
            <ProtectedRoute allowedRoles={['student']}>
              <QuizGame />
            </ProtectedRoute>
          } />
          <Route path="/games/typing" element={
            <ProtectedRoute allowedRoles={['student']}>
              <TypingGame />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;