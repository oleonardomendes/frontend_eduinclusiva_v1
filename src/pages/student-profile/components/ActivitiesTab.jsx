import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ActivitiesTab = ({ student, currentUser }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateActivity, setShowCreateActivity] = useState(false);

  const canCreateActivity = currentUser?.role === 'teacher' || currentUser?.role === 'coordinator';

  const activities = [
    {
      id: 1,
      title: 'Reconhecimento de Números 1-50',
      subject: 'Matemática',
      type: 'Exercício Interativo',
      difficulty: 'Básico',
      status: 'completed',
      score: 85,
      completedDate: '2024-10-22',
      duration: '25 min',
      description: 'Atividade focada no reconhecimento e sequenciamento de números de 1 a 50.',
      teacher: 'Prof. Ana Silva',
      feedback: 'Excelente progresso! Conseguiu identificar todos os números com apenas 2 erros.'
    },
    {
      id: 2,
      title: 'Leitura de Palavras Simples',
      subject: 'Português',
      type: 'Leitura Guiada',
      difficulty: 'Básico',
      status: 'completed',
      score: 78,
      completedDate: '2024-10-20',
      duration: '30 min',
      description: 'Leitura de palavras de 3 a 5 letras com apoio visual.',
      teacher: 'Prof. Ana Silva',
      feedback: 'Boa evolução na fluência. Precisa trabalhar mais as sílabas complexas.'
    },
    {
      id: 3,
      title: 'Pintura com Aquarela - Paisagem',
      subject: 'Artes',
      type: 'Atividade Criativa',
      difficulty: 'Intermediário',
      status: 'completed',
      score: 92,
      completedDate: '2024-10-18',
      duration: '45 min',
      description: 'Criação de paisagem usando técnicas básicas de aquarela.',
      teacher: 'Prof. Carlos Santos',
      feedback: 'Criatividade excepcional! Demonstrou controle motor fino muito bom.'
    },
    {
      id: 4,
      title: 'Coordenação Motora - Circuito',
      subject: 'Educação Física',
      type: 'Atividade Física',
      difficulty: 'Básico',
      status: 'in_progress',
      score: null,
      assignedDate: '2024-10-23',
      duration: '40 min',
      description: 'Circuito adaptado para desenvolvimento da coordenação motora grossa.',
      teacher: 'Prof. Maria Oliveira',
      feedback: null
    },
    {
      id: 5,
      title: 'Ciências - Partes do Corpo Humano',
      subject: 'Ciências',
      type: 'Exploração Sensorial',
      difficulty: 'Básico',
      status: 'assigned',
      score: null,
      assignedDate: '2024-10-25',
      duration: '35 min',
      description: 'Identificação das principais partes do corpo através de jogos e músicas.',
      teacher: 'Prof. Ana Silva',
      feedback: null
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'Todas as Atividades' },
    { value: 'completed', label: 'Concluídas' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'assigned', label: 'Atribuídas' }
  ];

  const subjectOptions = [
    { value: 'Matemática', label: 'Matemática' },
    { value: 'Português', label: 'Português' },
    { value: 'Ciências', label: 'Ciências' },
    { value: 'Artes', label: 'Artes' },
    { value: 'Educação Física', label: 'Educação Física' }
  ];

  const difficultyOptions = [
    { value: 'Básico', label: 'Básico' },
    { value: 'Intermediário', label: 'Intermediário' },
    { value: 'Avançado', label: 'Avançado' }
  ];

  const typeOptions = [
    { value: 'Exercício Interativo', label: 'Exercício Interativo' },
    { value: 'Leitura Guiada', label: 'Leitura Guiada' },
    { value: 'Atividade Criativa', label: 'Atividade Criativa' },
    { value: 'Atividade Física', label: 'Atividade Física' },
    { value: 'Exploração Sensorial', label: 'Exploração Sensorial' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'in_progress':
        return { icon: 'Clock', color: 'text-warning' };
      case 'assigned':
        return { icon: 'Calendar', color: 'text-primary' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Em Andamento';
      case 'assigned':
        return 'Atribuída';
      default:
        return 'Desconhecido';
    }
  };

  const getScoreBadgeColor = (score) => {
    if (!score) return '';
    if (score >= 80) return 'bg-success/10 text-success border-success/20';
    if (score >= 60) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  const filteredActivities = activities?.filter(activity => {
    const matchesFilter = selectedFilter === 'all' || activity?.status === selectedFilter;
    const matchesSearch = activity?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         activity?.subject?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-foreground">Atividades e Exercícios</h3>
        {canCreateActivity && (
          <Button
            variant="default"
            onClick={() => setShowCreateActivity(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Nova Atividade
          </Button>
        )}
      </div>
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar atividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={filterOptions}
            value={selectedFilter}
            onChange={setSelectedFilter}
            placeholder="Filtrar por status"
          />
        </div>
      </div>
      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities?.map((activity) => {
          const statusInfo = getStatusIcon(activity?.status);
          return (
            <div key={activity?.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-educational transition-educational">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                {/* Activity Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Icon name={statusInfo?.icon} size={20} className={`mt-0.5 ${statusInfo?.color}`} />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-md font-semibold text-foreground">{activity?.title}</h4>
                        {activity?.score && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getScoreBadgeColor(activity?.score)} mt-1 sm:mt-0`}>
                            {activity?.score}%
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Icon name="BookOpen" size={14} />
                          <span>{activity?.subject}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Tag" size={14} />
                          <span>{activity?.type}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="BarChart" size={14} />
                          <span>{activity?.difficulty}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} />
                          <span>{activity?.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="User" size={14} />
                          <span>{activity?.teacher}</span>
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2">{activity?.description}</p>

                      {activity?.feedback && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">Feedback:</span> {activity?.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Activity Actions */}
                <div className="flex flex-col space-y-2 lg:ml-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity?.status === 'completed' ? 'bg-success/10 text-success' :
                      activity?.status === 'in_progress'? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                    }`}>
                      {getStatusLabel(activity?.status)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {activity?.completedDate ? `Concluída em ${activity?.completedDate}` : 
                     activity?.assignedDate ? `Atribuída em ${activity?.assignedDate}` : ''}
                  </div>

                  {canCreateActivity && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" iconName="Eye">
                        Ver
                      </Button>
                      {activity?.status !== 'completed' && (
                        <Button variant="outline" size="sm" iconName="Edit">
                          Editar
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredActivities?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">Nenhuma atividade encontrada</h4>
          <p className="text-muted-foreground">
            {searchTerm ? 'Tente ajustar os termos de busca.' : 'Não há atividades para o filtro selecionado.'}
          </p>
        </div>
      )}
      {/* Create Activity Modal */}
      {showCreateActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Nova Atividade</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateActivity(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                label="Título da Atividade"
                type="text"
                placeholder="Digite o título da atividade"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Disciplina"
                  options={subjectOptions}
                  placeholder="Selecione a disciplina"
                  required
                />

                <Select
                  label="Tipo de Atividade"
                  options={typeOptions}
                  placeholder="Selecione o tipo"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Nível de Dificuldade"
                  options={difficultyOptions}
                  placeholder="Selecione a dificuldade"
                  required
                />

                <Input
                  label="Duração Estimada"
                  type="text"
                  placeholder="Ex: 30 min"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Descrição da Atividade</label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  rows={4}
                  placeholder="Descreva os objetivos e metodologia da atividade..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Objetivos de Aprendizagem</label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  rows={3}
                  placeholder="Liste os objetivos específicos que esta atividade pretende alcançar..."
                />
              </div>

              <Input
                label="Data de Atribuição"
                type="date"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateActivity(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                iconName="Save"
                iconPosition="left"
              >
                Criar Atividade
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Activity Statistics */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <h4 className="text-md font-medium text-foreground mb-4">Estatísticas de Atividades</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{activities?.filter(a => a?.status === 'completed')?.length}</div>
            <div className="text-sm text-muted-foreground">Concluídas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{activities?.filter(a => a?.status === 'in_progress')?.length}</div>
            <div className="text-sm text-muted-foreground">Em Andamento</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{activities?.filter(a => a?.status === 'assigned')?.length}</div>
            <div className="text-sm text-muted-foreground">Atribuídas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(activities?.filter(a => a?.score)?.reduce((acc, a) => acc + a?.score, 0) / activities?.filter(a => a?.score)?.length) || 0}%
            </div>
            <div className="text-sm text-muted-foreground">Média Geral</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesTab;