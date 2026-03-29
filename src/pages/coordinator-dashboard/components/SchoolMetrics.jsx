import React from 'react';
import Icon from '../../../components/AppIcon';

const SchoolMetrics = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Total de Alunos',
      value: metrics?.totalStudents,
      icon: 'Users',
      color: 'primary',
      change: '+12',
      changeType: 'positive'
    },
    {
      title: 'Planos Ativos',
      value: metrics?.activePlans,
      icon: 'BookOpen',
      color: 'secondary',
      change: '+8',
      changeType: 'positive'
    },
    {
      title: 'Engajamento dos Pais',
      value: `${metrics?.parentEngagement}%`,
      icon: 'Heart',
      color: 'accent',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Professores Ativos',
      value: metrics?.activeTeachers,
      icon: 'GraduationCap',
      color: 'success',
      change: '0',
      changeType: 'neutral'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      accent: 'bg-accent/10 text-accent',
      success: 'bg-success/10 text-success'
    };
    return colors?.[color] || colors?.primary;
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-educational">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Métricas da Escola</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>Outubro 2025</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricCards?.map((metric, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${getColorClasses(metric?.color)}`}>
                <Icon name={metric?.icon} size={16} />
              </div>
              <div className={`text-xs font-medium ${getChangeColor(metric?.changeType)}`}>
                {metric?.change !== '0' && (
                  <>
                    <Icon 
                      name={metric?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                      size={12} 
                      className="inline mr-1" 
                    />
                    {metric?.change}
                  </>
                )}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{metric?.value}</p>
            <p className="text-xs text-muted-foreground">{metric?.title}</p>
          </div>
        ))}
      </div>
      {/* Quick Stats */}
      <div className="border-t border-border pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Média de Progresso:</span>
            <span className="font-medium text-foreground">{metrics?.averageProgress}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Atividades Concluídas:</span>
            <span className="font-medium text-foreground">{metrics?.completedActivities}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolMetrics;