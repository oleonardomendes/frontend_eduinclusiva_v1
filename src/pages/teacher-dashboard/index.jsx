// src/pages/teacher-dashboard/index.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainNavigation from "../../components/ui/MainNavigation";
import BreadcrumbNavigation from "../../components/ui/BreadcrumbNavigation";
import StudentCard from "./components/StudentCard";
import TeachingPlanPanel from "./components/TeachingPlanPanel";
import ActivityTemplateLibrary from "./components/ActivityTemplateLibrary";
import QuickActionsPanel from "./components/QuickActionsPanel";
import CalendarView from "./components/CalendarView";
import ActivityBuilder from "./components/ActivityBuilder";

import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import StudentForm from "../../components/ui/StudentForm";

import { getAlunos, gerarPlanoAdaptado, uploadPDF } from "../../api/api";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("students");

  // modais
  const [isActivityBuilderOpen, setIsActivityBuilderOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);

  const [generatedPlan, setGeneratedPlan] = useState(null);

  // ✅ CADEADO: só abre modal quando usuário clicou em algo
  const allowOpenRef = useRef(false);

  const allowOpen = () => { allowOpenRef.current = true; };
  const disallowOpen = () => { allowOpenRef.current = false; };

  const openActivityBuilder = (source) => {
    if (!allowOpenRef.current) {
      console.log("[ActivityBuilder] open BLOCKED (source:", source, ")");
      return;
    }
    console.log("[ActivityBuilder] open by →", source);
    setIsActivityBuilderOpen(true);
    // depois de abrir, fecha o cadeado novamente (evita auto re-open)
    disallowOpen();
  };

  const closeActivityBuilder = () => {
    console.log("[ActivityBuilder] close by → user/UI");
    setIsActivityBuilderOpen(false);
    disallowOpen();
  };

  useEffect(() => {
    // importantíssimo: ao entrar na tela, garanta que começa fechado
    setIsActivityBuilderOpen(false);
    disallowOpen();

    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      if (!user?.role || user.role !== "teacher") {
        navigate("/login");
        return;
      }
      setCurrentUser(user);
      fetchAlunos();
    } catch {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  async function fetchAlunos() {
    try {
      const data = await getAlunos();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateAIPlan(aluno) {
    try {
      const payload = {
        aluno_id: aluno.id,
        descricao_aluno: `${aluno.nome}${aluno.idade ? `, ${aluno.idade} anos` : ""}, necessidade: ${
          aluno.necessidade || "não informada"
        }. ${aluno.observacoes || ""}`,
        conteudo: "Atividades adaptadas para necessidade especial",
        materia: "Geral",
        competencia: "Desenvolvimento pedagógico inclusivo",
      };

      const plano = await gerarPlanoAdaptado(payload);
      setGeneratedPlan({ ...plano, aluno });
      setIsPlanModalOpen(true);
    } catch (err) {
      console.error("Erro ao gerar plano:", err);
      alert("Erro ao gerar plano adaptado.");
    }
  }

  async function handleUploadActivityPDF(file, alunoId) {
    try {
      if (!file) return;
      await uploadPDF(file, alunoId);
      alert("Atividade enviada e indexada com sucesso!");
    } catch (err) {
      console.error("Erro no upload do PDF:", err);
      alert("Falha ao enviar arquivo.");
    }
  }

  function handleQuickAction(action) {
    switch (action) {
      case "createActivity":
        allowOpen(); // ✅ libera somente no clique do usuário
        openActivityBuilder("QuickActionsPanel");
        break;
      case "generateAIPlan":
        if (students.length > 0) handleGenerateAIPlan(students[0]);
        break;
      default:
        console.log("Ação não implementada:", action);
    }
  }

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

  const teachingPlan = {
    yearProgress: 68,
    annualComparison: { proposedProgress: 58, currentProgress: 68, comparison: 10, isAhead: true },
  };

  const calendarEvents = [
    { id: 1, title: "Aula de Matemática - Turma A", date: "2024-10-23", type: "aula" },
    { id: 2, title: "Avaliação Trimestral", date: "2024-10-28", type: "avaliacao" },
    { id: 3, title: "Reunião Pedagógica", date: "2024-10-25", type: "reuniao" },
  ];

  const tabs = [
    { id: "students", label: "Meus Alunos", icon: "Users" },
    { id: "planning", label: "Planejamento", icon: "Calendar" },
    { id: "activities", label: "Atividades", icon: "BookOpen" },
    { id: "calendar", label: "Calendário", icon: "CalendarDays" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />

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
                <Button variant="default" onClick={() => setIsStudentFormOpen(true)} iconName="UserPlus">
                  Novo Aluno
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => students.length > 0 && handleGenerateAIPlan(students[0])}
                  iconName="Sparkles"
                  iconPosition="left"
                  disabled={students.length === 0}
                >
                  Gerar Plano IA
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-8 border-b border-border">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-educational ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  <Icon name={tab.icon} size={16} className="sm:size-[18px]" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-8">
            {activeTab === "students" && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                <div className="xl:col-span-2">
                  {students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-lg bg-muted/20">
                      <Icon name="Users" size={48} className="text-muted-foreground mb-4 opacity-50" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Nenhum aluno cadastrado</h3>
                      <p className="text-muted-foreground text-sm mb-4 text-center max-w-xs">
                        Cadastre seu primeiro aluno para começar a gerar atividades e planos com IA
                      </p>
                      <Button variant="default" onClick={() => setIsStudentFormOpen(true)} iconName="UserPlus">
                        Cadastrar Primeiro Aluno
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {students.map((student) => (
                        <div key={student.id} className="relative border border-border rounded-lg p-4 bg-card shadow-educational">
                          <div className="mb-3">
                            <h3
                              className="font-semibold text-foreground text-base cursor-pointer hover:text-primary transition-colors"
                              onClick={() => navigate(`/student-profile/${student.id}`)}
                            >
                              {student.nome}
                            </h3>
                            {student.idade && <p className="text-sm text-muted-foreground">{student.idade} anos</p>}
                            {student.necessidade && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                                {student.necessidade}
                              </span>
                            )}
                            {student.observacoes && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{student.observacoes}</p>
                            )}
                          </div>

                          <StudentCard student={student} />

                          <div className="flex flex-wrap justify-between items-center mt-3 gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => navigate(`/student-profile/${student.id}`)}
                              iconName="User"
                              iconPosition="left"
                            >
                              Ver Perfil
                            </Button>
                            <Button variant="outline" onClick={() => handleGenerateAIPlan(student)}>
                              Gerar Plano IA
                            </Button>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => handleUploadActivityPDF(e.target.files?.[0], student.id)}
                              className="text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <QuickActionsPanel onActionClick={handleQuickAction} />
                </div>
              </div>
            )}

            {activeTab === "planning" && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                <div className="xl:col-span-2">
                  <TeachingPlanPanel teachingPlan={teachingPlan} />
                </div>
                <div className="w-full">
                  <QuickActionsPanel onActionClick={handleQuickAction} />
                </div>
              </div>
            )}

            {activeTab === "activities" && (
              <ActivityTemplateLibrary
                templates={[]}
                onSelectTemplate={() => {
                  allowOpen();
                  openActivityBuilder("ActivityTemplateLibrary");
                }}
              />
            )}

            {activeTab === "calendar" && (
              <CalendarView events={calendarEvents} onEventClick={() => {}} onDateClick={() => {}} />
            )}
          </div>
        </div>
      </main>

      {isStudentFormOpen && (
        <StudentForm
          onClose={() => setIsStudentFormOpen(false)}
          onSuccess={(novoAluno) => {
            setStudents((prev) => [...prev, novoAluno]);
            setIsStudentFormOpen(false);
          }}
        />
      )}

      <Modal
        open={isPlanModalOpen && !!generatedPlan}
        onClose={() => setIsPlanModalOpen(false)}
        title={generatedPlan ? `Plano Gerado para ${generatedPlan.aluno.nome}` : "Plano Gerado"}
        size="md"
      >
        {generatedPlan && (
          <div className="max-w-2xl mx-auto">
            <p className="text-sm mb-2 text-muted-foreground">{generatedPlan.titulo}</p>
            <div className="space-y-2">
              {(generatedPlan.atividades || []).map((a, i) => (
                <div key={i} className="p-2 border rounded bg-muted">
                  <p className="font-medium">{a.tipo}</p>
                  <p className="text-sm">{a.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ActivityBuilder
        isOpen={isActivityBuilderOpen}
        onClose={closeActivityBuilder}
        onSave={(payload) => console.log("[ActivityBuilder] onSave payload:", payload)}
      />
    </div>
  );
}