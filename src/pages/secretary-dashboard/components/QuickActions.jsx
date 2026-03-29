import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onActionClick }) => {
  const actions = [
    {
      id: 'generate-report',
      title: 'Gerar Relatório Geral',
      description: 'Relatório completo da rede municipal',
      icon: 'FileText',
      color: 'bg-blue-500',
      variant: 'default'
    },
    {
      id: 'manage-coordinators',
      title: 'Gerenciar Coordenadores',
      description: 'Atribuir e gerenciar coordenadores',
      icon: 'Users',
      color: 'bg-green-500',
      variant: 'secondary'
    },
    {
      id: 'system-announcements',
      title: 'Comunicados do Sistema',
      description: 'Enviar comunicados para toda a rede',
      icon: 'Megaphone',
      color: 'bg-purple-500',
      variant: 'outline'
    },
    {
      id: 'resource-allocation',
      title: 'Alocação de Recursos',
      description: 'Gerenciar recursos entre escolas',
      icon: 'Package',
      color: 'bg-orange-500',
      variant: 'outline'
    },
    {
      id: 'performance-analysis',
      title: 'Análise de Desempenho',
      description: 'Análise detalhada de performance',
      icon: 'TrendingUp',
      color: 'bg-emerald-500',
      variant: 'outline'
    },
    {
      id: 'emergency-protocols',
      title: 'Protocolos de Emergência',
      description: 'Ativar protocolos de emergência',
      icon: 'AlertTriangle',
      color: 'bg-red-500',
      variant: 'destructive'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-educational">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Zap" size={20} className="mr-2" />
          Ações Rápidas
        </h3>
        <Button variant="ghost" size="sm" iconName="Settings">
          Personalizar
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions?.map((action) => (
          <div
            key={action?.id}
            className="group p-4 border border-border rounded-lg hover:shadow-educational transition-educational hover-scale cursor-pointer"
            onClick={() => onActionClick(action?.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex items-center justify-center w-10 h-10 ${action?.color} rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon name={action?.icon} size={20} color="white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-primary transition-educational">
                  {action?.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {action?.description}
                </p>
              </div>
              
              <Icon 
                name="ArrowRight" 
                size={16} 
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" 
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Última atualização: {new Date()?.toLocaleString('pt-BR')}
          </span>
          <Button variant="ghost" size="sm" iconName="RefreshCw">
            Atualizar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;