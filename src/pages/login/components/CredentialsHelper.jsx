import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CredentialsHelper = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mockCredentials = [
    {
      role: 'Secretária de Educação',
      email: 'secretaria@educacao.sp.gov.br',
      password: 'SecretariaEdu2024!',
      description: 'Acesso completo ao sistema municipal'
    },
    {
      role: 'Coordenadora Escolar',
      email: 'coordenadora@escola.sp.gov.br',
      password: 'CoordenadoraEdu2024!',
      description: 'Gestão de escola e professores'
    },
    {
      role: 'Professora',
      email: 'professora@escola.sp.gov.br',
      password: 'ProfessoraEdu2024!',
      description: 'Criação de atividades e acompanhamento'
    },
    {
      role: 'Responsável',
      email: 'responsavel@email.com',
      password: 'ResponsavelEdu2024!',
      description: 'Portal dos pais e responsáveis'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text)?.then(() => {
      // Could add a toast notification here
    });
  };

  const handleQuickLogin = (email, password) => {
    // Auto-fill login form with the selected credentials
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    
    if (emailInput && passwordInput) {
      emailInput.value = email;
      passwordInput.value = password;
      
      // Trigger input events to update React state
      emailInput?.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput?.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
        className="w-full justify-between text-muted-foreground hover:text-foreground"
      >
        Credenciais de Demonstração
      </Button>
      {isExpanded && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground mb-3">
            Use as credenciais abaixo para testar diferentes níveis de acesso:
          </p>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => handleQuickLogin('responsavel@email.com', 'ResponsavelEdu2024!')}
              className="px-3 py-2 text-xs bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-educational"
            >
              Responsável
            </button>
            <button
              onClick={() => handleQuickLogin('professora@escola.sp.gov.br', 'ProfessoraEdu2024!')}
              className="px-3 py-2 text-xs bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-educational"
            >
              Professora
            </button>
            <button
              onClick={() => handleQuickLogin('coordenadora@escola.sp.gov.br', 'CoordenadoraEdu2024!')}
              className="px-3 py-2 text-xs bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-educational"
            >
              Coordenadora
            </button>
            <button
              onClick={() => handleQuickLogin('secretaria@educacao.sp.gov.br', 'SecretariaEdu2024!')}
              className="px-3 py-2 text-xs bg-success/10 text-success rounded-lg hover:bg-success/20 transition-educational"
            >
              Secretária
            </button>
          </div>
          
          {mockCredentials?.map((cred, index) => (
            <div key={index} className="p-3 bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground">{cred?.role}</h4>
                <div className="flex space-x-1">
                  <button
                    onClick={() => copyToClipboard(cred?.email)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-educational"
                    title="Copiar email"
                  >
                    <Icon name="Copy" size={12} />
                  </button>
                  <button
                    onClick={() => handleQuickLogin(cred?.email, cred?.password)}
                    className="p-1 text-primary hover:text-primary/80 transition-educational"
                    title="Auto-preencher formulário"
                  >
                    <Icon name="LogIn" size={12} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Email:</span>
                  <code className="bg-muted px-1 py-0.5 rounded text-foreground">
                    {cred?.email}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Senha:</span>
                  <code className="bg-muted px-1 py-0.5 rounded text-foreground">
                    {cred?.password}
                  </code>
                </div>
                <p className="text-muted-foreground italic">{cred?.description}</p>
              </div>
            </div>
          ))}

          <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={14} className="text-warning mt-0.5 flex-shrink-0" />
              <p className="text-xs text-warning">
                Estas são credenciais de demonstração. Em produção, use suas credenciais institucionais.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialsHelper;