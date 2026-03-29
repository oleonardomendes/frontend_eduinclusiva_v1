import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActionsPanel = ({ onActionClick }) => {
  const quickActions = [
    {
      id: 'new-activity',
      title: 'Nova Atividade',
      description: 'Criar atividade personalizada',
      icon: 'Plus',
      color: 'bg-primary text-primary-foreground',
      action: 'createActivity'
    },
    {
      id: 'assessment',
      title: 'Avaliação',
      description: 'Atualizar nível do aluno',
      icon: 'ClipboardCheck',
      color: 'bg-secondary text-secondary-foreground',
      action: 'updateAssessment'
    },
    {
      id: 'progress-report',
      title: 'Relatório',
      description: 'Gerar relatório de progresso',
      icon: 'FileText',
      color: 'bg-accent text-accent-foreground',
      action: 'generateReport'
    },
    {
      id: 'parent-communication',
      title: 'Comunicar Pais',
      description: 'Enviar atualização aos responsáveis',
      icon: 'MessageSquare',
      color: 'bg-success text-success-foreground',
      action: 'communicateParents'
    },
    {
      id: 'lesson-plan',
      title: 'Plano de Aula',
      description: 'Criar novo plano de aula',
      icon: 'Calendar',
      color: 'bg-warning text-warning-foreground',
      action: 'createLessonPlan'
    },
    {
      id: 'student-profile',
      title: 'Perfil do Aluno',
      description: 'Visualizar ou editar perfil',
      icon: 'User',
      color: 'bg-muted text-muted-foreground',
      action: 'viewStudentProfile'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-educational">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Ações Rápidas</h2>
        <Icon name="Zap" size={20} className="text-primary" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => onActionClick(action?.action)}
            className="group p-4 border border-border rounded-lg hover:border-primary/50 transition-educational hover-scale text-left"
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action?.color} group-hover:scale-110 transition-transform`}>
                <Icon name={action?.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {action?.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {action?.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Recent Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Ações Recentes</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">Atividade de matemática criada</p>
              <p className="text-xs text-muted-foreground">Há 2 horas</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
            <Icon name="FileText" size={16} className="text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">Relatório enviado aos pais</p>
              <p className="text-xs text-muted-foreground">Ontem</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
            <Icon name="User" size={16} className="text-secondary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">Perfil de Ana atualizado</p>
              <p className="text-xs text-muted-foreground">2 dias atrás</p>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Atividades Criadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary">8</p>
            <p className="text-xs text-muted-foreground">Relatórios Enviados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">24</p>
            <p className="text-xs text-muted-foreground">Alunos Ativos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;