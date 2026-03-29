// src/pages/login/index.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import { api } from 'api/api';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const dashboardRoutes = {
      secretary: '/secretary-dashboard',
      coordinator: '/coordinator-dashboard',
      teacher: '/teacher-dashboard',
      parent: '/parent-portal',
    };

    const currentUserRaw = localStorage.getItem('currentUser');
    if (currentUserRaw) {
      try {
        const user = JSON.parse(currentUserRaw);
        navigate(dashboardRoutes?.[user?.role] || '/login');
        return;
      } catch {}
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    let mounted = true;
    (async () => {
      try {
        const { data: me } = await api.get('/auth/me');
        if (!mounted || !me) return;

        const papel = String(me.papel || '').toLowerCase();
        const roleMap = {
          secretaria: 'secretary',
          coordenadora: 'coordinator',
          professor: 'teacher',
          familia: 'parent',
          responsável: 'parent',
          responsavel: 'parent',
        };
        const role = roleMap[papel] || 'teacher';

        localStorage.setItem('currentUser', JSON.stringify({
          id: me.id, name: me.nome, email: me.email, role
        }));
        navigate(dashboardRoutes[role] || '/login');
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
      }
    })();

    return () => { mounted = false; };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-card rounded-2xl shadow-educational-lg border border-border p-8">
          <LoginHeader />
          <LoginForm />
          {/* CredentialsHelper removido */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Prefeitura Municipal de São Paulo
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Secretaria Municipal de Educação
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>Sistema Seguro</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>LGPD Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span>Dados Protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;