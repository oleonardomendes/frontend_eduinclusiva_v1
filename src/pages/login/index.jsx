import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import CredentialsHelper from './components/CredentialsHelper';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const dashboardRoutes = {
        secretary: '/secretary-dashboard',
        coordinator: '/coordinator-dashboard',
        teacher: '/teacher-dashboard',
        parent: '/parent-portal'
      };
      navigate(dashboardRoutes?.[user?.role] || '/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-card rounded-2xl shadow-educational-lg border border-border p-8">
          {/* Header Section */}
          <LoginHeader />

          {/* Login Form */}
          <LoginForm />

          {/* Demo Credentials Helper */}
          <CredentialsHelper />

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} Prefeitura Municipal de São Paulo
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Secretaria Municipal de Educação
            </p>
          </div>
        </div>

        {/* Additional Trust Signals */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Sistema Seguro</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>LGPD Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Dados Protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;