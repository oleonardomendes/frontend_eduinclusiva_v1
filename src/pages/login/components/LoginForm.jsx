// src/pages/login/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

// Consumo real de API
import { api } from 'api/api';                 // GET /auth/me
import { login as loginApi } from 'api/auth';  // POST /auth/login → salva token

// Mapa de papel do backend -> role que o Router usa
const roleMap = {
  secretaria: 'secretary',
  coordenadora: 'coordinator',
  professor: 'teacher',
  familia: 'parent',
  responsavel: 'parent',
  responsável: 'parent',
};

const dashboardRoutes = {
  secretary: '/secretary-dashboard',
  coordinator: '/coordinator-dashboard',
  teacher: '/teacher-dashboard',
  parent: '/parent-portal',
};

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleInputChange(e) {
    const { name, value } = e?.target || {};
    setFormData((prev) => ({ ...prev, [name]: value }));

    // limpa erros ao digitar
    if (name && errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errors?.general) {
      setErrors((prev) => ({ ...prev, general: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!formData?.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData?.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }
    if (!formData?.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (isLoading) return;
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // 1) Autentica → salva token
      await loginApi(formData.email, formData.password); // envia { email, senha }

      // 2) Quem sou eu → pega papel
      const { data: me } = await api.get('/auth/me'); // { id, nome, email, papel }

      const papel = String(me?.papel || '').toLowerCase();
      const role = roleMap[papel] || 'teacher';

      // 3) Salva currentUser no formato do Router
      const currentUser = {
        id: me?.id,
        name: me?.nome,
        email: me?.email,
        role,
      };
      try {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      } catch {}

      // 4) Redireciona
      navigate(dashboardRoutes[role] || '/teacher-dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Erro geral */}
        {errors?.general && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
              <p className="text-sm text-error">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Email */}
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Digite seu email institucional"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
          disabled={isLoading}
          autoComplete="username"
        />

        {/* Senha */}
        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-educational"
            disabled={isLoading}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {/* Entrar */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          iconName="LogIn"
          iconPosition="right"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>

        {/* Esqueci minha senha */}
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-educational font-medium"
            onClick={() => {
              alert('Funcionalidade de recuperação de senha será implementada em breve.');
            }}
            disabled={isLoading}
          >
            Esqueci minha senha
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;