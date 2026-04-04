import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import AtividadeModal from '../../../components/ui/AtividadeModal';
import { gerarAtividade, getAtividadesGeradas } from '../../../api/api';

// ─── Opções dos selects do formulário de geração ──────────────────────────────
const DISCIPLINAS = [
  { value: 'Geral',              label: 'Geral'              },
  { value: 'Matemática',         label: 'Matemática'         },
  { value: 'Português',          label: 'Português'          },
  { value: 'Ciências',           label: 'Ciências'           },
  { value: 'Arte',               label: 'Arte'               },
  { value: 'Educação Física',    label: 'Educação Física'    },
];

const TIPOS = [
  { value: 'Exercício prático',  label: 'Exercício prático'  },
  { value: 'Jogo educativo',     label: 'Jogo educativo'     },
  { value: 'Leitura',            label: 'Leitura'            },
  { value: 'Escrita',            label: 'Escrita'            },
  { value: 'Cálculo',            label: 'Cálculo'            },
  { value: 'Atividade artística',label: 'Atividade artística'},
];

const DIFICULDADES = [
  { value: 'Fácil',   label: 'Fácil'   },
  { value: 'Médio',   label: 'Médio'   },
  { value: 'Difícil', label: 'Difícil' },
];

const DIFICULDADE_CLS = {
  "fácil":  "bg-green-100 text-green-700 border-green-200",
  "facil":  "bg-green-100 text-green-700 border-green-200",
  "médio":  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "medio":  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "difícil":"bg-red-100 text-red-700 border-red-200",
  "dificil":"bg-red-100 text-red-700 border-red-200",
};

// ─── Opções dos selects da lista de atividades (planos) ───────────────────────
const filterOptions = [
  { value: 'all',         label: 'Todas as Atividades' },
  { value: 'completed',   label: 'Concluídas'          },
  { value: 'in_progress', label: 'Em Andamento'        },
  { value: 'assigned',    label: 'Atribuídas'          },
];

const subjectOptions = [
  { value: 'Matemática',      label: 'Matemática'      },
  { value: 'Português',       label: 'Português'       },
  { value: 'Ciências',        label: 'Ciências'        },
  { value: 'Artes',           label: 'Artes'           },
  { value: 'Educação Física', label: 'Educação Física' },
];

const difficultyOptions = [
  { value: 'Básico',        label: 'Básico'        },
  { value: 'Intermediário', label: 'Intermediário' },
  { value: 'Avançado',      label: 'Avançado'      },
];

const typeOptions = [
  { value: 'Exercício Interativo', label: 'Exercício Interativo' },
  { value: 'Leitura Guiada',       label: 'Leitura Guiada'       },
  { value: 'Atividade Criativa',   label: 'Atividade Criativa'   },
  { value: 'Atividade Física',     label: 'Atividade Física'     },
  { value: 'Exploração Sensorial', label: 'Exploração Sensorial' },
];

// ─────────────────────────────────────────────────────────────────────────────

const ActivitiesTab = ({ student, currentUser, planos }) => {
  // ── filtros / busca da lista legada ────────────────────────────────────────
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm]         = useState('');
  const [showCreateActivity, setShowCreateActivity] = useState(false);

  // ── atividades geradas via IA ──────────────────────────────────────────────
  const [atividadesGeradas, setAtividadesGeradas] = useState([]);
  const [atividadeAtual, setAtividadeAtual]       = useState(null);
  const [fonteAtual, setFonteAtual]               = useState(null);
  const [isModalOpen, setIsModalOpen]             = useState(false);
  const [loadingGerar, setLoadingGerar]           = useState(false);
  const [erroGerar, setErroGerar]                 = useState(null);

  // ── formulário de geração ──────────────────────────────────────────────────
  const [form, setForm] = useState({
    disciplina:            'Geral',
    tipo:                  'Exercício prático',
    dificuldade:           'Médio',
    duracao:               30,
    tema:                  '',
    objetivos_especificos: '',
  });

  const canCreateActivity =
    currentUser?.role === 'teacher' || currentUser?.role === 'coordinator';

  // ── carregar atividades geradas ────────────────────────────────────────────
  useEffect(() => {
    if (!student?.id) return;
    getAtividadesGeradas(student.id)
      .then((data) => setAtividadesGeradas(Array.isArray(data) ? data : []))
      .catch(() => setAtividadesGeradas([]));
  }, [student?.id]);

  // ── gerar nova atividade ───────────────────────────────────────────────────
  async function handleGerarAtividade(e) {
    e.preventDefault();
    setLoadingGerar(true);
    setErroGerar(null);

    const parametros = {
      disciplina:            form.disciplina,
      tipo_atividade:        form.tipo,
      dificuldade:           form.dificuldade,
      duracao_minutos:       Number(form.duracao),
      ...(form.tema                  ? { tema: form.tema }                                   : {}),
      ...(form.objetivos_especificos ? { objetivos_especificos: form.objetivos_especificos } : {}),
    };

    try {
      const result = await gerarAtividade(student.id, parametros);
      // resposta pode ser { atividade, fonte } ou diretamente o objeto da atividade
      const atividade = result?.atividade ?? result;
      const fonte     = result?.fonte     ?? 'ia_nova';

      setAtividadesGeradas((prev) => [atividade, ...prev]);
      setAtividadeAtual(atividade);
      setFonteAtual(fonte);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Erro ao gerar atividade:', err);
      setErroGerar('Não foi possível gerar a atividade. Tente novamente.');
    } finally {
      setLoadingGerar(false);
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setAtividadeAtual(null);
    setFonteAtual(null);
  }

  // ── mapeamento planos → activities (lista legada) ─────────────────────────
  const activities =
    Array.isArray(planos) && planos.length > 0
      ? planos.map((plano, i) => ({
          id:            plano.id ?? i,
          title:         plano.titulo || `Plano de IA ${i + 1}`,
          subject:       plano.materia || 'Geral',
          type:          'Plano Adaptado IA',
          difficulty:    'Adaptado',
          status:        'completed',
          score:         null,
          completedDate: plano.criado_em
            ? new Date(plano.criado_em).toLocaleDateString('pt-BR')
            : null,
          duration:    '—',
          description: plano.conteudo || plano.descricao_aluno || '',
          teacher:     '',
          feedback:
            Array.isArray(plano.atividades) && plano.atividades.length > 0
              ? plano.atividades.map((a) => `${a.tipo}: ${a.descricao}`).join(' | ')
              : null,
        }))
      : [];

  const getStatusIcon  = (s) =>
    s === 'completed'   ? { icon: 'CheckCircle', color: 'text-success'           } :
    s === 'in_progress' ? { icon: 'Clock',       color: 'text-warning'           } :
    s === 'assigned'    ? { icon: 'Calendar',    color: 'text-primary'           } :
                          { icon: 'Circle',      color: 'text-muted-foreground'  };

  const getStatusLabel = (s) =>
    s === 'completed'   ? 'Concluída'   :
    s === 'in_progress' ? 'Em Andamento':
    s === 'assigned'    ? 'Atribuída'   : 'Desconhecido';

  const getScoreBadgeColor = (score) =>
    !score        ? '' :
    score >= 80   ? 'bg-success/10 text-success border-success/20'          :
    score >= 60   ? 'bg-warning/10 text-warning border-warning/20'          :
                    'bg-destructive/10 text-destructive border-destructive/20';

  const filteredActivities = activities.filter((a) => {
    const matchesFilter = selectedFilter === 'all' || a.status === selectedFilter;
    const matchesSearch =
      a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ══ PAINEL DE GERAÇÃO IA ══════════════════════════════════════════════ */}
      {canCreateActivity && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-educational">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <Icon name="Sparkles" size={17} className="text-primary" />
            Gerar Nova Atividade com IA
          </h3>

          <form onSubmit={handleGerarAtividade} className="space-y-4">
            {/* Linha 1: Disciplina + Tipo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Disciplina</label>
                <Select
                  options={DISCIPLINAS}
                  value={form.disciplina}
                  onChange={(v) => setForm((f) => ({ ...f, disciplina: v }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Tipo de Atividade</label>
                <Select
                  options={TIPOS}
                  value={form.tipo}
                  onChange={(v) => setForm((f) => ({ ...f, tipo: v }))}
                />
              </div>
            </div>

            {/* Linha 2: Dificuldade + Duração */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Nível de Dificuldade</label>
                <Select
                  options={DIFICULDADES}
                  value={form.dificuldade}
                  onChange={(v) => setForm((f) => ({ ...f, dificuldade: v }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Duração (minutos)</label>
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={form.duracao}
                  onChange={(e) => setForm((f) => ({ ...f, duracao: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Linha 3: Tema */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Tema / Descrição <span className="text-muted-foreground/60">(opcional)</span>
              </label>
              <textarea
                rows={2}
                value={form.tema}
                onChange={(e) => setForm((f) => ({ ...f, tema: e.target.value }))}
                placeholder="Ex: Animais da fazenda, contagem até 10…"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            {/* Linha 4: Objetivos específicos */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Objetivos Específicos <span className="text-muted-foreground/60">(opcional)</span>
              </label>
              <textarea
                rows={2}
                value={form.objetivos_especificos}
                onChange={(e) => setForm((f) => ({ ...f, objetivos_especificos: e.target.value }))}
                placeholder="Ex: Trabalhar coordenação motora fina, reconhecer sílabas…"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            {/* Erro */}
            {erroGerar && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <Icon name="AlertCircle" size={16} className="shrink-0" />
                {erroGerar}
              </div>
            )}

            {/* Botão de geração */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="default"
                iconName={loadingGerar ? 'Loader2' : 'Sparkles'}
                iconPosition="left"
                disabled={loadingGerar}
              >
                {loadingGerar ? 'Gerando…' : '✨ Gerar Atividade'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ══ ATIVIDADES GERADAS POR IA (histórico) ════════════════════════════ */}
      {atividadesGeradas.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Icon name="Sparkles" size={15} className="text-primary" />
            Atividades Geradas por IA
          </h4>
          <div className="space-y-2">
            {atividadesGeradas.map((at, i) => {
              const difKey = at.dificuldade?.toLowerCase?.() || '';
              const difCls = DIFICULDADE_CLS[difKey] || 'bg-muted text-muted-foreground border-border';
              return (
                <div
                  key={at.id ?? i}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:shadow-educational transition-educational"
                >
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-sm font-medium text-foreground truncate">
                      {at.titulo || `Atividade ${i + 1}`}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {at.criado_em && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(at.criado_em).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      {at.dificuldade && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${difCls}`}>
                          {at.dificuldade}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    iconPosition="left"
                    onClick={() => {
                      setAtividadeAtual(at);
                      setFonteAtual(at.fonte ?? 'ia_nova');
                      setIsModalOpen(true);
                    }}
                  >
                    Ver detalhes
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ HEADER + FILTROS DOS PLANOS LEGADOS ══════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Atividades e Exercícios</h3>
        {canCreateActivity && (
          <Button
            variant="outline"
            onClick={() => setShowCreateActivity(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Nova Atividade Manual
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar atividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* ══ LISTA DE PLANOS/ATIVIDADES ════════════════════════════════════════ */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => {
          const statusInfo = getStatusIcon(activity.status);
          return (
            <div key={activity.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-educational transition-educational">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Icon name={statusInfo.icon} size={20} className={`mt-0.5 ${statusInfo.color}`} />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-md font-semibold text-foreground">{activity.title}</h4>
                        {activity.score && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getScoreBadgeColor(activity.score)} mt-1 sm:mt-0`}>
                            {activity.score}%
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Icon name="BookOpen" size={14} /><span>{activity.subject}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Tag" size={14} /><span>{activity.type}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="BarChart" size={14} /><span>{activity.difficulty}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} /><span>{activity.duration}</span>
                        </span>
                        {activity.teacher && (
                          <span className="flex items-center space-x-1">
                            <Icon name="User" size={14} /><span>{activity.teacher}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                      {activity.feedback && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">Feedback:</span> {activity.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 lg:ml-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed'   ? 'bg-success/10 text-success'  :
                    activity.status === 'in_progress' ? 'bg-warning/10 text-warning'  :
                                                        'bg-primary/10 text-primary'
                  }`}>
                    {getStatusLabel(activity.status)}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {activity.completedDate ? `Concluída em ${activity.completedDate}` :
                     activity.assignedDate  ? `Atribuída em ${activity.assignedDate}`  : ''}
                  </div>
                  {canCreateActivity && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" iconName="Eye">Ver</Button>
                      {activity.status !== 'completed' && (
                        <Button variant="outline" size="sm" iconName="Edit">Editar</Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">Nenhuma atividade encontrada</h4>
          <p className="text-muted-foreground">
            {searchTerm
              ? 'Tente ajustar os termos de busca.'
              : 'Não há atividades para o filtro selecionado.'}
          </p>
        </div>
      )}

      {/* ══ MODAL MANUAL (criação simples) ═══════════════════════════════════ */}
      {showCreateActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Nova Atividade</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateActivity(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            <div className="space-y-4">
              <Input label="Título da Atividade" type="text" placeholder="Digite o título da atividade" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Disciplina"         options={subjectOptions}    placeholder="Selecione a disciplina" required />
                <Select label="Tipo de Atividade"  options={typeOptions}       placeholder="Selecione o tipo"       required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Nível de Dificuldade" options={difficultyOptions} placeholder="Selecione a dificuldade" required />
                <Input  label="Duração Estimada"      type="text"                placeholder="Ex: 30 min"              required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Descrição da Atividade</label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  rows={4}
                  placeholder="Descreva os objetivos e metodologia da atividade..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Objetivos de Aprendizagem</label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  rows={3}
                  placeholder="Liste os objetivos específicos que esta atividade pretende alcançar..."
                />
              </div>
              <Input label="Data de Atribuição" type="date" required />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateActivity(false)}>Cancelar</Button>
              <Button variant="default" iconName="Save" iconPosition="left">Criar Atividade</Button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ESTATÍSTICAS ════════════════════════════════════════════════════ */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <h4 className="text-md font-medium text-foreground mb-4">Estatísticas de Atividades</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{activities.filter(a => a.status === 'completed').length}</div>
            <div className="text-sm text-muted-foreground">Concluídas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{activities.filter(a => a.status === 'in_progress').length}</div>
            <div className="text-sm text-muted-foreground">Em Andamento</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{activities.filter(a => a.status === 'assigned').length}</div>
            <div className="text-sm text-muted-foreground">Atribuídas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(
                activities.filter(a => a.score).reduce((acc, a) => acc + a.score, 0) /
                (activities.filter(a => a.score).length || 1)
              ) || 0}%
            </div>
            <div className="text-sm text-muted-foreground">Média Geral</div>
          </div>
        </div>
      </div>

      {/* ══ MODAL DE ATIVIDADE GERADA ════════════════════════════════════════ */}
      {isModalOpen && atividadeAtual && (
        <AtividadeModal
          atividade={atividadeAtual}
          fonte={fonteAtual}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ActivitiesTab;
