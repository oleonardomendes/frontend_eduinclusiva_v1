import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TeachingPlanPanel = ({ teachingPlan }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date()?.getMonth());

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Concluído': 'bg-success text-success-foreground',
      'Em Andamento': 'bg-warning text-warning-foreground',
      'Planejado': 'bg-muted text-muted-foreground',
      'Atrasado': 'bg-destructive text-destructive-foreground'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const currentMonthPlan = teachingPlan?.monthlyPlans?.[selectedMonth];
  
  // Calculate annual progress comparison
  const calculateProgressComparison = () => {
    const currentDate = new Date();
    const currentMonth = currentDate?.getMonth(); // 0-indexed
    const totalMonths = 12;
    
    // Expected progress based on time of year (what was proposed)
    const expectedProgress = ((currentMonth + 1) / totalMonths) * 100;
    
    // Actual progress (what has been completed)
    const actualProgress = teachingPlan?.yearProgress || 0;
    
    // Comparison percentage
    const comparison = actualProgress - expectedProgress;
    
    return {
      expected: Math.round(expectedProgress),
      actual: actualProgress,
      comparison: Math.round(comparison),
      isAhead: comparison >= 0
    };
  };

  const progressComparison = calculateProgressComparison();

  return (
    <div className="bg-card border border-border rounded-lg shadow-educational">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Plano Anual de Ensino</h2>
          <Button variant="outline" size="sm" iconName="Calendar">
            Calendário Municipal
          </Button>
        </div>
        
        {/* Annual Progress Comparison - NEW SECTION */}
        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center">
              <Icon name="BarChart3" size={16} className="mr-2 text-primary" />
              Comparativo Anual de Progresso
            </h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              progressComparison?.isAhead ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            }`}>
              {progressComparison?.isAhead ? 'Adiantado' : 'Atrasado'} 
              {progressComparison?.comparison > 0 ? '+' : ''}{progressComparison?.comparison}%
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-muted-foreground">{progressComparison?.expected}%</div>
              <div className="text-xs text-muted-foreground">Proposto no Calendário</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{progressComparison?.actual}%</div>
              <div className="text-xs text-muted-foreground">Realizado até Agora</div>
            </div>
          </div>
          
          <div className="space-y-2">
            {/* Expected Progress Bar */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Meta esperada</span>
                <span>{progressComparison?.expected}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 bg-muted-foreground rounded-full transition-all duration-300"
                  style={{ width: `${progressComparison?.expected}%` }}
                />
              </div>
            </div>
            
            {/* Actual Progress Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground">Progresso atual</span>
                <span className="text-foreground font-medium">{progressComparison?.actual}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progressComparison?.isAhead ? 'bg-success' : 'bg-warning'
                  }`}
                  style={{ width: `${progressComparison?.actual}%` }}
                />
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3">
            {progressComparison?.isAhead 
              ? `A sala está ${Math.abs(progressComparison?.comparison)}% à frente do cronograma planejado no início do ano.`
              : `A sala está ${Math.abs(progressComparison?.comparison)}% atrás do cronograma planejado no início do ano.`
            }
          </p>
        </div>
        
        {/* Year Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progresso do Ano Letivo</span>
            <span className="text-sm text-muted-foreground">{teachingPlan?.yearProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-2 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${teachingPlan?.yearProgress}%` }}
            />
          </div>
        </div>

        {/* Month Selector */}
        <div className="flex flex-wrap gap-1">
          {months?.map((month, index) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(index)}
              className={`px-3 py-1 text-xs rounded-full transition-educational ${
                selectedMonth === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {month?.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
      {/* Monthly Plan Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">
            {months?.[selectedMonth]} {new Date()?.getFullYear()}
          </h3>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentMonthPlan?.status)}`}>
            {currentMonthPlan?.status}
          </span>
        </div>

        {/* Current Objectives */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Icon name="Target" size={16} className="mr-2 text-primary" />
            Objetivos Atuais
          </h4>
          <div className="space-y-2">
            {currentMonthPlan?.objectives?.map((objective, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  objective?.completed ? 'bg-success' : 'bg-warning'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{objective?.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{objective?.description}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-xs text-muted-foreground">
                      Prazo: {objective?.deadline}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Progresso: {objective?.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Icon name="Flag" size={16} className="mr-2 text-secondary" />
            Próximos Marcos
          </h4>
          <div className="space-y-2">
            {currentMonthPlan?.milestones?.map((milestone, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Calendar" size={16} className="text-secondary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{milestone?.title}</p>
                    <p className="text-xs text-muted-foreground">{milestone?.date}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  milestone?.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                  milestone?.priority === 'Média'? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {milestone?.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="default" size="sm" iconName="Plus" className="flex-1">
            Adicionar Objetivo
          </Button>
          <Button variant="outline" size="sm" iconName="Edit" className="flex-1">
            Editar Plano
          </Button>
          <Button variant="outline" size="sm" iconName="Download" className="flex-1">
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeachingPlanPanel;