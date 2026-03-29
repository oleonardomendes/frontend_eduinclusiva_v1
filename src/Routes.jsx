import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

import CoordinatorDashboard from "pages/coordinator-dashboard";
import SecretaryDashboard from "pages/secretary-dashboard";
import LoginPage from "pages/login";
import StudentProfile from "pages/student-profile";
import ParentPortal from "pages/parent-portal";
import TeacherDashboard from "pages/teacher-dashboard";

import ProtectedRoute from "components/ProtectedRoute";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* públicas */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* protegidas */}
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/coordinator-dashboard"
            element={
              <ProtectedRoute>
                <CoordinatorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator-dashboard/:schoolId"
            element={
              <ProtectedRoute>
                <CoordinatorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/secretary-dashboard"
            element={
              <ProtectedRoute>
                <SecretaryDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-profile"
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-profile/:studentId"
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parent-portal"
            element={
              <ProtectedRoute>
                <ParentPortal />
              </ProtectedRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;