import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import { PracticeCatalogPage } from './pages/practice/PracticeCatalogPage';
import { PracticeWorkspacePage } from './pages/practice/PracticeWorkspacePage';
import { InterviewRoomPage } from './pages/mock/InterviewRoomPage';
import { ReportPage } from './pages/mock/ReportPage';
import { ResumeScannerPage } from './pages/resume/ResumeScannerPage';
import { ChatInterviewPage } from './pages/interview/ChatInterviewPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import useAuthStore from './store/useAuthStore';

export const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 transition-colors">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            
            {/* Public Teaser Routes */}
            <Route path="/practice" element={<PracticeCatalogPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/practice/:id" element={<PracticeWorkspacePage />} />
              <Route path="/mock/room/:id" element={<InterviewRoomPage />} />
              <Route path="/mock/report/:id" element={<ReportPage />} />
              <Route path="/resume" element={<ResumeScannerPage />} />
              <Route path="/chat-interview" element={<ChatInterviewPage />} />
              <Route path="/chat-interview/:id" element={<ChatInterviewPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

