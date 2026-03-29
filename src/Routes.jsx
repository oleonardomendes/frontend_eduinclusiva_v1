import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import CoordinatorDashboard from './pages/coordinator-dashboard';
import SecretaryDashboard from './pages/secretary-dashboard';
import LoginPage from './pages/login';
import StudentProfile from './pages/student-profile';
import ParentPortal from './pages/parent-portal';
import TeacherDashboard from './pages/teacher-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/coordinator-dashboard" element={<CoordinatorDashboard />} />
        <Route path="/coordinator-dashboard/:schoolId" element={<CoordinatorDashboard />} />
        <Route path="/secretary-dashboard" element={<SecretaryDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/student-profile/:studentId" element={<StudentProfile />} />
        <Route path="/parent-portal" element={<ParentPortal />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;