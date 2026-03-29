import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import StudentCard from './components/StudentCard';
import TeachingPlanPanel from './components/TeachingPlanPanel';
import ActivityTemplateLibrary from './components/ActivityTemplateLibrary';
import QuickActionsPanel from './components/QuickActionsPanel';
import CalendarView from './components/CalendarView';
import ActivityBuilder from './components/ActivityBuilder';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal'; // adicione esse modal simples se ainda não tiver
import { getAlunos, gerarPlanoAdaptado, uploadPDF } from '../../api/api';
import DialogForm from "../../components/ui/DialogForm";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [isActivityBuilderOpen, setIsActivityBuilderOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Carregar usuário e alunos
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user?.role || user?.role !== 'teacher') {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const fetchAlunos = async () => {
      try {
        const data = await getAlunos();
        setStudents(data);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlunos();
  }, [navigate]);

  // ======== GERAÇÃO DE PLANO COM IA ========
  const handleGenerateAIPlan = async (aluno) => {
    try {
      const payload = {
        aluno_id: aluno.id,
        descricao_aluno: `${aluno.name}, ${aluno.grade}, progresso atual: ${aluno.progress}%`,
        conteudo: "Leitura e interpretação de texto",
        materia: "Português",
        competencia: "Compreensão textual",
      };
      const plano = await gerarPlanoAdaptado(payload);
      setGeneratedPlan({ ...plano, aluno });
      setIsPlanModalOpen(true);
    } catch (err) {
      console.error("Erro ao gerar plano:", err);
      alert("Erro ao gerar plano adaptado.");
    }
  };

  // ======== UPLOAD DE PDF (para IA ler histórico) ========
  const handleUploadActivityPDF = async (file, alunoId) => {
    try {
      const res = await uploadPDF(file, alunoId);
      alert("Atividade enviada e indexada com sucesso!");
      console.log(res);
    } catch (err) {
      console.error("Erro no upload do PDF:", err);
      alert("Falha ao enviar arquivo.");
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'createActivity':
        setIsActivityBuilderOpen(true);
        break;
      case 'generateAIPlan':
        if (students.length > 0) handleGenerateAIPlan(students[0]);
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  const handleToggleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Mock temporário (planejamento e calendário continuam locais)
  const teachingPlan = {
    yearProgress: 68,
    annualComparison: {
      proposedProgress: 58,
      currentProgress: 68,
      comparison: 10,
      isAhead: true
    }
  };

  const calendarEvents = [
    { id: 1, title: "Aula de Matemática - Turma A", date: "2024-10-23", type: "aula" },
    { id: 2, title: "Avaliação Trimestral", date: "2024-10-28", type: "avaliacao" },
    { id: 3, title: "Reunião Pedagógica", date: "2024-10-25", type: "reuniao" },
  ];

  const tabs = [
    { id: 'students', label: 'Meus Alunos', icon: 'Users' },
    { id: 'planning', label: 'Planejamento', icon: 'Calendar' },
    { id: 'activities', label: 'Atividades', icon: 'BookOpen' },
    { id: 'calendar', label: 'Calendário', icon: 'CalendarDays' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={handleToggleNavCollapse} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Olá, {currentUser?.name}! 👋
                </h1>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Gerencie seus alunos e crie atividades personalizadas para educação especial
                </p>
              </div>
              <div className="shrink-0 flex gap-2">
                <Button
                  variant="default"
                  onClick={() => setIsDialogOpen(true)}
                  iconName="Plus"
                >
                  Nova Atividade
                </Button>

                {isDialogOpen && (
                  <DialogForm
                    onClose={() => setIsDialogOpen(false)}
                    onSuccess={(newActivity) => {
                      console.log("Atividade criada:", newActivity);
                      // aqui você pode atualizar a lista de atividades exibidas
                    }}
                  />
                )}

                <Button
                  variant="secondary"
                  onClick={() => handleGenerateAIPlan(students[0])}
                  iconName="Sparkles"
                  iconPosition="left"
                >
                  Gerar Plano IA
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8 border-b border-border">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-educational ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <Icon name={tab.icon} size={16} className="sm:size-[18px]" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Conteúdo das abas */}
          <div className="space-y-8">
            {activeTab === 'students' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                <div className="xl:col-span-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {students.map((student) => (
                      <div key={student.id} className="relative border border-border rounded-lg p-4 bg-card shadow-educational">
                        <StudentCard student={student} />
                        <div className="flex justify-between items-center mt-3">
                          <Button
                            variant="outline"
                            onClick={() => handleGenerateAIPlan(student)}
                          >
                            Gerar Plano IA
                          </Button>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => handleUploadActivityPDF(e.target.files[0], student.id)}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full">
                  <QuickActionsPanel onActionClick={handleQuickAction} />
                </div>
              </div>
            )}

            {activeTab === 'planning' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                <div className="xl:col-span-2">
                  <TeachingPlanPanel teachingPlan={teachingPlan} />
                </div>
                <div className="w-full">
                  <QuickActionsPanel onActionClick={handleQuickAction} />
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <ActivityTemplateLibrary templates={[]} onSelectTemplate={() => {}} />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                events={calendarEvents}
                onEventClick={() => {}}
                onDateClick={() => {}}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modal com o plano gerado pela IA */}
      {isPlanModalOpen && generatedPlan && (
        <Modal onClose={() => setIsPlanModalOpen(false)}>
          <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-primary">
              Plano Gerado para {generatedPlan.aluno.name}
            </h2>
            <p className="text-sm mb-2 text-muted-foreground">
              {generatedPlan.titulo}
            </p>
            <div className="space-y-2">
              {generatedPlan.atividades?.map((a, i) => (
                <div key={i} className="p-2 border rounded bg-muted">
                  <p className="font-medium">{a.tipo}</p>
                  <p className="text-sm">{a.descricao}</p>
                  <p className="text-xs text-muted-foreground">
                    Duração: {a.duracao} min
                  </p>
                </div>
              ))}
            </div>
            {generatedPlan.recomendacoes?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-foreground mb-1">Recomendações:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {generatedPlan.recomendacoes.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal para criar atividades */}
      <ActivityBuilder
        isOpen={isActivityBuilderOpen}
        onClose={() => setIsActivityBuilderOpen(false)}
        onSave={() => {}}
      />
    </div>
  );
};

export default TeacherDashboard;