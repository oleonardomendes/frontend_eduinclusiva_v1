import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressTab = ({ student, currentUser, historico, metricas }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const progressData = [
    { month: 'Mar', matematica: 45, portugues: 50, ciencias: 40, artes: 60 },
    { month: 'Abr', matematica: 52, portugues: 58, ciencias: 48, artes: 65 },
    { month: 'Mai', matematica: 58, portugues: 62, ciencias: 55, artes: 70 },
    { month: 'Jun', matematica: 65, portugues: 68, ciencias: 62, artes: 75 },
    { month: 'Jul', matematica: 70, portugues: 72, ciencias: 68, artes: 78 },
    { month: 'Ago', matematica: 75, portugues: 78, ciencias: 72, artes: 82 },
    { month: 'Set', matematica: 78, portugues: 80, ciencias: 75, artes: 85 },
    { month: 'Out', matematica: 82, portugues: 85, ciencias: 80, artes: 88 }
  ];

  const skillsData = [
    { skill: 'Comunicação', progress: 85, color: 'bg-success' },
    { skill: 'Coordenação Motora', progress: 72, color: 'bg-primary' },
    { skill: 'Socialização', progress: 78, color: 'bg-secondary' },
    { skill: 'Autonomia', progress: 65, color: 'bg-accent' },
    { skill: 'Concentração', progress: 70, color: 'bg-warning' }
  ];

  const recentActivities = Array.isArray(historico) && historico.length > 0
    ? historico.map((item, i) => ({
        id: item.id ?? i,
        date: item.criado_em
          ? new Date(item.criado_em).toLocaleDateString('pt-BR')
          : '',
        activity: item.titulo || `Plano de IA #${i + 1}`,
        score: null,
        teacher: '',
        notes:
          Array.isArray(item.atividades) && item.atividades.length > 0
            ? item.atividades.map((a) => `${a.tipo}: ${a.descricao}`).join(' | ')
            : item.conteudo || '',
      }))
    : [];

  const milestones = [
    {
      id: 1,
      date: '2024-10-01',
      title: 'Primeira Avaliação Trimestral',
      description: 'Avaliação completa das habilidades desenvolvidas no primeiro trimestre.',
      status: 'completed',
      score: 75
    },
    {
      id: 2,
      date: '2024-09-15',
      title: 'Objetivo: Reconhecimento de Letras',
      description: 'Conseguiu identificar todas as letras do alfabeto com 90% de precisão.',
      status: 'completed',
      score: 90
    },
    {
      id: 3,
      date: '2024-08-20',
      title: 'Desenvolvimento da Autonomia',
      description: 'Demonstrou capacidade de realizar tarefas básicas de forma independente.',
      status: 'completed',
      score: 80
    },
    {
      id: 4,
      date: '2024-11-15',
      title: 'Segunda Avaliação Trimestral',
      description: 'Próxima avaliação programada para novembro.',
      status: 'upcoming',
      score: null
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-success/10 text-success border-success/20';
    if (score >= 60) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-foreground">Progresso e Desenvolvimento</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            Último Mês
          </Button>
          <Button
            variant={selectedPeriod === 'semester' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('semester')}
          >
            Semestre
          </Button>
          <Button
            variant={selectedPeriod === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('year')}
          >
            Ano Letivo
          </Button>
        </div>
      </div>
      {/* Progress Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-medium text-foreground mb-4">Evolução por Disciplina</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="matematica" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                name="Matemática"
              />
              <Line 
                type="monotone" 
                dataKey="portugues" 
                stroke="var(--color-secondary)" 
                strokeWidth={2}
                name="Português"
              />
              <Line 
                type="monotone" 
                dataKey="ciencias" 
                stroke="var(--color-accent)" 
                strokeWidth={2}
                name="Ciências"
              />
              <Line 
                type="monotone" 
                dataKey="artes" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                name="Artes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Skills Development */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-medium text-foreground mb-4">Desenvolvimento de Habilidades</h4>
        <div className="space-y-4">
          {skillsData?.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{skill?.skill}</span>
                <span className="text-sm text-muted-foreground">{skill?.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    skill?.progress >= 80 ? 'bg-success' :
                    skill?.progress >= 60 ? 'bg-primary' : 'bg-warning'
                  }`}
                  style={{ width: `${skill?.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-md font-medium text-foreground mb-4">Histórico de Planos IA</h4>
          <div className="space-y-4">
            {recentActivities.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum plano gerado ainda.</p>
            )}
            {recentActivities?.map((activity) => (
              <div key={activity?.id} className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-foreground">{activity?.activity}</h5>
                    <p className="text-xs text-muted-foreground">{activity?.teacher} • {activity?.date}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getScoreBadgeColor(activity?.score)}`}>
                    {activity?.score}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{activity?.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-md font-medium text-foreground mb-4">Marcos de Desenvolvimento</h4>
          <div className="space-y-4">
            {milestones?.map((milestone) => (
              <div key={milestone?.id} className="flex items-start space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  milestone?.status === 'completed' ? 'bg-success/10' : 'bg-muted'
                }`}>
                  <Icon 
                    name={milestone?.status === 'completed' ? 'CheckCircle' : 'Clock'} 
                    size={16} 
                    className={milestone?.status === 'completed' ? 'text-success' : 'text-muted-foreground'} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-foreground">{milestone?.title}</h5>
                    {milestone?.score && (
                      <span className={`text-sm font-medium ${getScoreColor(milestone?.score)}`}>
                        {milestone?.score}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{milestone?.date}</p>
                  <p className="text-sm text-muted-foreground">{milestone?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Progress Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="TrendingUp" size={24} className="text-primary mt-1" />
          <div>
            <h4 className="text-md font-medium text-foreground">Resumo do Progresso</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {student?.name} demonstra progresso consistente em todas as áreas de desenvolvimento. 
              O foco atual está no fortalecimento das habilidades de concentração e autonomia, 
              com excelentes resultados em atividades artísticas e comunicação.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Progresso Geral</p>
                <p className="font-semibold text-primary text-lg">
                  {student?.overallProgress != null ? `${student.overallProgress}%` : '—'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Atividades Concluídas</p>
                <p className="font-semibold text-foreground text-lg">
                  {metricas?.total_planos ?? historico?.length ?? 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Próxima Meta</p>
                <p className="font-semibold text-foreground text-lg">85%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTab;