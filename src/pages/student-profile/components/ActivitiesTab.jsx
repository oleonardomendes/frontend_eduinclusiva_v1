import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Modal from '../../../components/ui/Modal';
import AtividadeModal from '../../../components/ui/AtividadeModal';
import { gerarAtividade, getAtividadesGeradas, api } from '../../../api/api';

// ── Opções dos selects do formulário de geração ───────────────────────────────
const DISCIPLINAS = [
  { value: 'Geral',           label: 'Geral'           },
  { value: 'Matemática',      label: 'Matemática'      },
  { value: 'Português',       label: 'Português'       },
  { value: 'Ciências',        label: 'Ciências'        },
  { value: 'Arte',            label: 'Arte'            },
  { value: 'Educação Física', label: 'Educação Física' },
];
const TIPOS = [
  { value: 'Exercício prático',   label: 'Exercício prático'   },
  { value: 'Jogo educativo',      label: 'Jogo educativo'      },
  { value: 'Leitura',             label: 'Leitura'             },
  { value: 'Escrita',             label: 'Escrita'             },
  { value: 'Cálculo',             label: 'Cálculo'             },
  { value: 'Atividade artística', label: 'Atividade artística' },
];
const DIFICULDADES = [
  { value: 'Fácil',   label: 'Fácil'   },
  { value: 'Médio',   label: 'Médio'   },
  { value: 'Difícil', label: 'Difícil' },
];

// Mapa de classes para badge de dificuldade
const DIFICULDADE_CLS = {
  'fácil':  'bg-green-100 text-green-700 border-green-200',
  'facil':  'bg-green-100 text-green-700 border-green-200',
  'médio':  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'medio':  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'difícil':'bg-red-100 text-red-700 border-red-200',
  'dificil':'bg-red-100 text-red-700 border-red-200',
};

// ─────────────────────────────────────────────────────────────────────────────

const ActivitiesTab = ({ student, currentUser }) => {
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

  // ── modal de conclusão ─────────────────────────────────────────────────────
  const [conclusaoId, setConclusaoId]           = useState(null);
  const [isConfirmOpen, setIsConfirmOpen]       = useState(false);
  const [obsText, setObsText]                   = useState('');
  const [loadingConcluir, setLoadingConcluir]   = useState(false);
  const [erroConcluir, setErroConcluir]         = useState(null);

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
      disciplina:       form.disciplina,
      tipo_atividade:   form.tipo,
      dificuldade:      form.dificuldade,
      duracao_minutos:  Number(form.duracao),
      ...(form.tema                  ? { tema: form.tema }                                   : {}),
      ...(form.objetivos_especificos ? { objetivos_especificos: form.objetivos_especificos } : {}),
    };
    try {
      const result = await gerarAtividade(student.id, parametros);
      const atividade = result?.atividade ?? result;
      const fonte     = result?.fonte     ?? 'ia_nova';
      setAtividadesGeradas((prev) => [atividade, ...prev]);
      setAtividadeAtual(atividade);
      setFonteAtual(fonte);
      setIsModalOpen(true);
    } catch {
      setErroGerar('Não foi possível gerar a atividade. Tente novamente.');
    } finally {
      setLoadingGerar(false);
    }
  }

  // ── concluir atividade ─────────────────────────────────────────────────────
  function abrirConclusao(id) {
    setConclusaoId(id);
    setObsText('');
    setErroConcluir(null);
    setIsConfirmOpen(true);
  }

  async function handleConcluir() {
    setLoadingConcluir(true);
    setErroConcluir(null);
    try {
      await api.patch(`/ai/atividades/${conclusaoId}/concluir`, { observacoes: obsText });
      setAtividadesGeradas((prev) =>
        prev.map((a) => (a.id === conclusaoId ? { ...a, concluida: true } : a))
      );
      setIsConfirmOpen(false);
    } catch (err) {
      if (err?.response?.status === 404) {
        setErroConcluir('Funcionalidade em breve disponível.');
      } else {
        setErroConcluir('Não foi possível concluir. Tente novamente.');
      }
    } finally {
      setLoadingConcluir(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ══ PAINEL DE GERAÇÃO IA ═════════════════════════════════════════════ */}
      {canCreateActivity && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-educational">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <Icon name="Sparkles" size={17} className="text-primary" />
            Gerar Nova Atividade com IA
          </h3>

          <form onSubmit={handleGerarAtividade} className="space-y-4">
            {/* Disciplina + Tipo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Disciplina</label>
                <Select options={DISCIPLINAS} value={form.disciplina} onChange={(v) => setForm((f) => ({ ...f, disciplina: v }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Tipo de Atividade</label>
                <Select options={TIPOS} value={form.tipo} onChange={(v) => setForm((f) => ({ ...f, tipo: v }))} />
              </div>
            </div>

            {/* Dificuldade + Duração */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Nível de Dificuldade</label>
                <Select options={DIFICULDADES} value={form.dificuldade} onChange={(v) => setForm((f) => ({ ...f, dificuldade: v }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Duração (minutos)</label>
                <input
                  type="number" min={10} max={60} value={form.duracao}
                  onChange={(e) => setForm((f) => ({ ...f, duracao: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Tema */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Tema / Descrição <span className="opacity-60">(opcional)</span>
              </label>
              <textarea
                rows={2} value={form.tema}
                onChange={(e) => setForm((f) => ({ ...f, tema: e.target.value }))}
                placeholder="Ex: Animais da fazenda, contagem até 10…"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            {/* Objetivos */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Objetivos Específicos <span className="opacity-60">(opcional)</span>
              </label>
              <textarea
                rows={2} value={form.objetivos_especificos}
                onChange={(e) => setForm((f) => ({ ...f, objetivos_especificos: e.target.value }))}
                placeholder="Ex: Trabalhar coordenação motora fina, reconhecer sílabas…"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            {erroGerar && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <Icon name="AlertCircle" size={16} className="shrink-0" />
                {erroGerar}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit" variant="default"
                iconName={loadingGerar ? 'Loader2' : 'Sparkles'} iconPosition="left"
                disabled={loadingGerar}
              >
                {loadingGerar ? 'Gerando…' : '✨ Gerar Atividade'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ══ LISTA DE ATIVIDADES GERADAS ══════════════════════════════════════ */}
      {atividadesGeradas.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Icon name="Sparkles" size={15} className="text-primary" />
            Atividades Geradas por IA
            <span className="ml-1 px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-normal">
              {atividadesGeradas.length}
            </span>
          </h4>

          <div className="space-y-3">
            {atividadesGeradas.map((at, i) => {
              const difKey  = at.dificuldade?.toLowerCase?.() || '';
              const difCls  = DIFICULDADE_CLS[difKey] || 'bg-muted text-muted-foreground border-border';
              const concluida = !!at.concluida;

              return (
                <div
                  key={at.id ?? i}
                  className="border border-border rounded-lg p-4 bg-card hover:shadow-educational transition-educational space-y-2"
                >
                  {/* Linha 1: título + badge status */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {at.titulo || `Atividade ${i + 1}`}
                    </p>
                    <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      concluida
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {concluida ? '✓ Concluída' : 'Pendente'}
                    </span>
                  </div>

                  {/* Linha 2: data | dificuldade | disciplina */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    {at.criado_em && (
                      <span className="text-muted-foreground">
                        {new Date(at.criado_em).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    {at.dificuldade && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium border ${difCls}`}>
                        {at.dificuldade}
                      </span>
                    )}
                    {at.materia && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-medium">
                        {at.materia}
                      </span>
                    )}
                  </div>

                  {/* Linha 3: ações */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline" size="sm"
                      iconName="Eye" iconPosition="left"
                      onClick={() => {
                        setAtividadeAtual(at);
                        setFonteAtual(at.fonte ?? 'ia_nova');
                        setIsModalOpen(true);
                      }}
                    >
                      Ver detalhes
                    </Button>
                    {!concluida && canCreateActivity && (
                      <Button
                        variant="outline" size="sm"
                        iconName="Check" iconPosition="left"
                        onClick={() => abrirConclusao(at.id)}
                      >
                        ✓ Concluir
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        !loadingGerar && (
          <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
            <Icon name="Sparkles" size={40} className="text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium text-foreground mb-1">Nenhuma atividade gerada ainda</p>
            <p className="text-xs text-muted-foreground">
              Use o formulário acima para gerar a primeira atividade com IA.
            </p>
          </div>
        )
      )}

      {/* ══ MODAL DE ATIVIDADE GERADA ════════════════════════════════════════ */}
      {isModalOpen && atividadeAtual && (
        <AtividadeModal
          atividade={atividadeAtual}
          fonte={fonteAtual}
          onClose={() => {
            setIsModalOpen(false);
            setAtividadeAtual(null);
            setFonteAtual(null);
          }}
        />
      )}

      {/* ══ MODAL DE CONCLUSÃO ═══════════════════════════════════════════════ */}
      <Modal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Concluir Atividade"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground">Marcar atividade como concluída?</p>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Observações gerais <span className="opacity-60">(opcional)</span>
            </label>
            <textarea
              rows={3}
              value={obsText}
              onChange={(e) => setObsText(e.target.value)}
              placeholder="Como foi a atividade? O aluno conseguiu realizar?"
              className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {erroConcluir && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <Icon name="AlertCircle" size={15} className="shrink-0" />
              {erroConcluir}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => setIsConfirmOpen(false)} disabled={loadingConcluir}>
              Cancelar
            </Button>
            <Button
              variant="default" size="sm"
              iconName={loadingConcluir ? 'Loader2' : 'Check'} iconPosition="left"
              onClick={handleConcluir}
              disabled={loadingConcluir}
            >
              {loadingConcluir ? 'Salvando…' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ActivitiesTab;
