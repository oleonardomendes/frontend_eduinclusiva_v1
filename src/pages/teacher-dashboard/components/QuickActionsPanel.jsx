import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Select from "../../../components/ui/Select";
import AtividadeModal from "../../../components/ui/AtividadeModal";
import { gerarAtividade } from "../../../api/api";

const DISCIPLINAS = [
  { value: "Geral",           label: "Geral"           },
  { value: "Matemática",      label: "Matemática"      },
  { value: "Português",       label: "Português"       },
  { value: "Ciências",        label: "Ciências"        },
  { value: "Arte",            label: "Arte"            },
  { value: "Educação Física", label: "Educação Física" },
];
const TIPOS = [
  { value: "Exercício prático",   label: "Exercício prático"   },
  { value: "Jogo educativo",      label: "Jogo educativo"      },
  { value: "Leitura",             label: "Leitura"             },
  { value: "Escrita",             label: "Escrita"             },
  { value: "Cálculo",             label: "Cálculo"             },
  { value: "Atividade artística", label: "Atividade artística" },
];
const DIFICULDADES = [
  { value: "Fácil",   label: "Fácil"   },
  { value: "Médio",   label: "Médio"   },
  { value: "Difícil", label: "Difícil" },
];

const FORM_DEFAULT = {
  disciplina: "Geral",
  tipo: "Exercício prático",
  dificuldade: "Médio",
  duracao: 30,
  tema: "",
  objetivos: "",
};

function QuickActionsPanel({ onActionClick, students = [] }) {
  // ── form modal ─────────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen]         = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState("");
  const [form, setForm]                     = useState(FORM_DEFAULT);
  const [loadingGerar, setLoadingGerar]     = useState(false);
  const [erroGerar, setErroGerar]           = useState(null);

  // ── atividade modal ────────────────────────────────────────────────────────
  const [atividadeGerada, setAtividadeGerada]       = useState(null);
  const [isAtividadeModalOpen, setIsAtividadeModalOpen] = useState(false);

  const handle = (action) => {
    if (action === "createActivity") {
      setErroGerar(null);
      setSelectedAlunoId(students.length === 1 ? String(students[0].id) : "");
      setForm(FORM_DEFAULT);
      setIsFormOpen(true);
      return;
    }
    if (typeof onActionClick === "function") onActionClick(action);
  };

  async function handleGerar(e) {
    e.preventDefault();
    if (!selectedAlunoId) {
      setErroGerar("Selecione um aluno.");
      return;
    }
    setLoadingGerar(true);
    setErroGerar(null);
    try {
      const result = await gerarAtividade(Number(selectedAlunoId), {
        disciplina:       form.disciplina,
        tipo_atividade:   form.tipo,
        dificuldade:      form.dificuldade,
        duracao_minutos:  Number(form.duracao),
        ...(form.tema     ? { tema: form.tema }                         : {}),
        ...(form.objetivos ? { objetivos_especificos: form.objetivos }  : {}),
      });
      const atividade = result?.atividade ?? result;
      setIsFormOpen(false);
      setAtividadeGerada(atividade);
      setIsAtividadeModalOpen(true);
    } catch {
      setErroGerar("Não foi possível gerar a atividade. Tente novamente.");
    } finally {
      setLoadingGerar(false);
    }
  }

  const alunoOptions = students.map((s) => ({
    value: String(s.id),
    label: s.nome || s.name || `Aluno ${s.id}`,
  }));

  const quickActions = [
    {
      id: "new-activity",
      title: "Nova Atividade",
      description: "Gerar atividade com IA",
      icon: "Plus",
      color: "bg-primary text-primary-foreground",
      action: "createActivity",
    },
    {
      id: "assessment",
      title: "Avaliação",
      description: "Atualizar nível do aluno",
      icon: "ClipboardCheck",
      color: "bg-secondary text-secondary-foreground",
      action: "updateAssessment",
    },
    {
      id: "progress-report",
      title: "Relatório",
      description: "Gerar relatório de progresso",
      icon: "FileText",
      color: "bg-accent text-accent-foreground",
      action: "generateReport",
    },
    {
      id: "parent-communication",
      title: "Comunicar Pais",
      description: "Enviar atualização aos responsáveis",
      icon: "MessageSquare",
      color: "bg-success text-success-foreground",
      action: "communicateParents",
    },
    {
      id: "lesson-plan",
      title: "Plano de Aula",
      description: "Criar novo plano de aula",
      icon: "Calendar",
      color: "bg-warning text-warning-foreground",
      action: "createLessonPlan",
    },
    {
      id: "student-profile",
      title: "Perfil do Aluno",
      description: "Visualizar ou editar perfil",
      icon: "User",
      color: "bg-muted text-muted-foreground",
      action: "viewStudentProfile",
    },
  ];

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 shadow-educational">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Ações Rápidas</h2>
          <Icon name="Zap" size={20} className="text-primary" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {quickActions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handle(item.action)}
              className="group p-4 border border-border rounded-lg hover:border-primary/50 transition-educational hover-scale text-left"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon name={item.icon} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Ações Recentes */}
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

      {/* ── Modal formulário de geração ────────────────────────────────────── */}
      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="✨ Gerar Atividade com IA"
        size="md"
      >
        <form onSubmit={handleGerar} className="space-y-4">
          {/* Aluno */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Aluno</label>
            {alunoOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum aluno cadastrado.</p>
            ) : (
              <Select
                options={alunoOptions}
                value={selectedAlunoId}
                onChange={setSelectedAlunoId}
                placeholder="Selecione o aluno..."
              />
            )}
          </div>

          {selectedAlunoId && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Disciplina</label>
                  <Select options={DISCIPLINAS} value={form.disciplina} onChange={(v) => setForm((f) => ({ ...f, disciplina: v }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Tipo</label>
                  <Select options={TIPOS} value={form.tipo} onChange={(v) => setForm((f) => ({ ...f, tipo: v }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Dificuldade</label>
                  <Select options={DIFICULDADES} value={form.dificuldade} onChange={(v) => setForm((f) => ({ ...f, dificuldade: v }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Duração (min)</label>
                  <input
                    type="number" min={10} max={60} value={form.duracao}
                    onChange={(e) => setForm((f) => ({ ...f, duracao: e.target.value }))}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Tema / Descrição <span className="opacity-60">(opcional)</span></label>
                <textarea
                  rows={2} value={form.tema}
                  onChange={(e) => setForm((f) => ({ ...f, tema: e.target.value }))}
                  placeholder="Ex: Animais da fazenda, contagem até 10…"
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Objetivos <span className="opacity-60">(opcional)</span></label>
                <textarea
                  rows={2} value={form.objetivos}
                  onChange={(e) => setForm((f) => ({ ...f, objetivos: e.target.value }))}
                  placeholder="Ex: Trabalhar coordenação motora fina…"
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </>
          )}

          {erroGerar && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <Icon name="AlertCircle" size={15} className="shrink-0" />
              {erroGerar}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsFormOpen(false)} disabled={loadingGerar}>
              Cancelar
            </Button>
            <Button
              type="submit" variant="default" size="sm"
              iconName={loadingGerar ? "Loader2" : "Sparkles"} iconPosition="left"
              disabled={loadingGerar || !selectedAlunoId}
            >
              {loadingGerar ? "Gerando…" : "✨ Gerar Atividade"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Modal resultado ────────────────────────────────────────────────── */}
      {isAtividadeModalOpen && atividadeGerada && (
        <AtividadeModal
          atividade={atividadeGerada}
          fonte="ia_nova"
          onClose={() => {
            setIsAtividadeModalOpen(false);
            setAtividadeGerada(null);
          }}
        />
      )}
    </>
  );
}

export default React.memo(QuickActionsPanel);
