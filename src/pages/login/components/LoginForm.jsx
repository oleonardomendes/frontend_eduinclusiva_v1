import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock credentials for different user roles
  const mockCredentials = {
    'secretaria@educacao.sp.gov.br': {
      password: 'SecretariaEdu2024!',
      role: 'secretary',
      name: 'Maria Silva Santos',
      school: 'Secretaria Municipal de Educação'
    },
    'coordenadora@escola.sp.gov.br': {
      password: 'CoordenadoraEdu2024!',
      role: 'coordinator',
      name: 'Ana Paula Oliveira',
      school: 'EMEF Prof. João Carlos'
    },
    'professora@escola.sp.gov.br': {
      password: 'ProfessoraEdu2024!',
      role: 'teacher',
      name: 'Carla Regina Lima',
      school: 'EMEF Prof. João Carlos'
    },
    'responsavel@email.com': {
      password: 'ResponsavelEdu2024!',
      role: 'parent',
      name: 'Roberto Ferreira',
      school: 'EMEF Prof. João Carlos'
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    if (!formData?.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = mockCredentials?.[formData?.email];
      
      if (!user || user?.password !== formData?.password) {
        setErrors({
          general: 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.'
        });
        setIsLoading(false);
        return;
      }

      // Store user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        email: formData?.email,
        role: user?.role,
        name: user?.name,
        school: user?.school
      }));

      // Navigate to appropriate dashboard based on role
      const dashboardRoutes = {
        secretary: '/secretary-dashboard',
        coordinator: '/coordinator-dashboard',
        teacher: '/teacher-dashboard',
        parent: '/parent-portal'
      };

      navigate(dashboardRoutes?.[user?.role]);
      setIsLoading(false);
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {errors?.general && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
              <p className="text-sm text-error">{errors?.general}</p>
            </div>
          </div>
        )}

        {/* Email Input */}
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Digite seu email institucional"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Digite sua senha"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-educational"
            disabled={isLoading}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
          </button>
        </div>

        {/* Submit Button */}
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

        {/* Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-educational font-medium"
            onClick={() => {
              // Handle forgot password - could navigate to forgot password page
              alert('Funcionalidade de recuperação de senha será implementada em breve.');
            }}
          >
            Esqueci minha senha
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;