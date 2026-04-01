import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BIMESTRES = [
  { id: 1, label: '1º Bimestre' },
  { id: 2, label: '2º Bimestre' },
  { id: 3, label: '3º Bimestre' },
  { id: 4, label: '4º Bimestre' },
];

// Normaliza o resumo de avaliações para array [{bimestre, realizado}]
function normalizeResumo(resumo) {
  if (!resumo) return [];
  if (Array.isArray(resumo)) {
    return resumo.map((item) => ({
      bimestre: item.bimestre,
      realizado: item.media_progresso ?? item.progresso_real ?? null,
    }));
  }
  // Formato objeto: { bimestre_1: { progresso_real: 72 }, ... }
  return Object.entries(resumo).map(([key, val]) => {
    const num = parseInt(key.replace('bimestre_', ''), 10);
    return {
      bimestre: num,
      realizado: val?.progresso_real ?? val?.media_progresso ?? null,
    };
  });
}

const TeachingPlanPanel = ({ metas = [], avaliacoesResumo = [], anoAtual, salaDefault = '', onMetaCreated }) => {
  const currentBimestre = Math.min(Math.ceil((new Date().getMonth() + 1) / 3), 4);
  const [selectedBimestre, setSelectedBimestre] = useState(currentBimestre);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bimestre: String(currentBimestre),
    meta_progresso: '',
    descricao: '',
    sala: salaDefault,
    ano: String(anoAtual),
  });

  const resumoNorm = normalizeResumo(avaliacoesResumo);

  const getMetaBimestre = (b) => metas.find((m) => m.bimestre === b || m.bimestre === String(b));
  const getRealizadoBimestre = (b) => resumoNorm.find((r) => r.bimestre === b || r.bimestre === String(b));

  const metaAtual = getMetaBimestre(selectedBimestre);
  const realizadoAtual = getRealizadoBimestre(selectedBimestre);

  const hasMetas = metas.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.meta_progresso) return;
    setSaving(true);
    try {
      await onMetaCreated?.({
        bimestre: parseInt(form.bimestre, 10),
        meta_progresso: parseFloat(form.meta_progresso),
        descricao: form.descricao || null,
        sala: form.sala || null,
        ano: parseInt(form.ano, 10),
      });
      setShowForm(false);
      setForm((prev) => ({ ...prev, meta_progresso: '', descricao: '' }));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-educational">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Plano Anual de Ensino</h2>
          <span className="text-sm text-muted-foreground">{anoAtual}</span>
        </div>

        {/* Bimestre selector */}
        <div className="flex flex-wrap gap-2">
          {BIMESTRES.map((b) => {
            const hasMeta = !!getMetaBimestre(b.id);
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBimestre(b.id)}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-educational flex items-center gap-1 ${
                  selectedBimestre === b.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {b.label}
                {hasMeta && (
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedBimestre === b.id ? 'bg-primary-foreground/60' : 'bg-success'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!hasMetas && !showForm ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon name="Target" size={24} className="text-primary" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">Nenhuma meta definida</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Defina as metas de progresso para cada bimestre do ano letivo {anoAtual}.
            </p>
            <Button variant="default" size="sm" iconName="Plus" iconPosition="left" onClick={() => setShowForm(true)}>
              Definir Metas do Ano
            </Button>
          </div>
        ) : (
          <>
            {/* Bimestre detail */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="BarChart3" size={16} className="text-primary" />
                {BIMESTRES[selectedBimestre - 1].label} — Comparativo
              </h3>

              {!metaAtual ? (
                <div className="p-4 bg-muted/40 rounded-lg text-sm text-muted-foreground flex items-center justify-between">
                  <span>Nenhuma meta definida para este bimestre.</span>
                  <Button variant="outline" size="sm" iconName="Plus" iconPosition="left" onClick={() => {
                    setForm((prev) => ({ ...prev, bimestre: String(selectedBimestre) }));
                    setShowForm(true);
                  }}>
                    Definir
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Meta vs Realizado numbers */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-bold text-foreground">{metaAtual.meta_progresso ?? '—'}%</p>
                      <p className="text-xs text-muted-foreground">Meta</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className={`text-lg font-bold ${realizadoAtual?.realizado != null ? 'text-primary' : 'text-muted-foreground'}`}>
                        {realizadoAtual?.realizado != null ? `${realizadoAtual.realizado}%` : '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">Realizado</p>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Meta</span>
                        <span>{metaAtual.meta_progresso ?? 0}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 bg-muted-foreground rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(metaAtual.meta_progresso ?? 0, 100)}%` }}
                        />
                      </div>
                    </div>
                    {realizadoAtual?.realizado != null && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground">Realizado</span>
                          <span className="font-medium text-foreground">{realizadoAtual.realizado}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              realizadoAtual.realizado >= (metaAtual.meta_progresso ?? 0)
                                ? 'bg-success'
                                : 'bg-warning'
                            }`}
                            style={{ width: `${Math.min(realizadoAtual.realizado, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status badge */}
                  {realizadoAtual?.realizado != null && (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      realizadoAtual.realizado >= (metaAtual.meta_progresso ?? 0)
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      <Icon
                        name={realizadoAtual.realizado >= (metaAtual.meta_progresso ?? 0) ? 'TrendingUp' : 'TrendingDown'}
                        size={12}
                      />
                      {realizadoAtual.realizado >= (metaAtual.meta_progresso ?? 0)
                        ? `${(realizadoAtual.realizado - (metaAtual.meta_progresso ?? 0)).toFixed(1)}% acima da meta`
                        : `${((metaAtual.meta_progresso ?? 0) - realizadoAtual.realizado).toFixed(1)}% abaixo da meta`}
                    </div>
                  )}

                  {metaAtual.descricao && (
                    <p className="text-sm text-muted-foreground">{metaAtual.descricao}</p>
                  )}
                </div>
              )}
            </div>

            {/* All bimestres overview */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="List" size={16} className="text-muted-foreground" />
                Visão Geral do Ano
              </h3>
              <div className="space-y-2">
                {BIMESTRES.map((b) => {
                  const m = getMetaBimestre(b.id);
                  const r = getRealizadoBimestre(b.id);
                  return (
                    <div
                      key={b.id}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-educational ${
                        selectedBimestre === b.id ? 'bg-primary/5' : 'hover:bg-muted/40'
                      }`}
                      onClick={() => setSelectedBimestre(b.id)}
                    >
                      <span className="text-xs text-muted-foreground w-20 shrink-0">{b.label}</span>
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        {m && (
                          <div
                            className={`h-1.5 rounded-full ${
                              r?.realizado != null
                                ? r.realizado >= (m.meta_progresso ?? 0) ? 'bg-success' : 'bg-warning'
                                : 'bg-muted-foreground/40'
                            }`}
                            style={{ width: `${Math.min(r?.realizado ?? m.meta_progresso ?? 0, 100)}%` }}
                          />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right shrink-0">
                        {m ? `${m.meta_progresso}%` : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add meta button */}
            {!showForm && (
              <Button variant="outline" size="sm" iconName="Plus" iconPosition="left" onClick={() => {
                setForm((prev) => ({ ...prev, bimestre: String(selectedBimestre) }));
                setShowForm(true);
              }}>
                {metaAtual ? 'Nova Meta' : 'Definir Meta'}
              </Button>
            )}
          </>
        )}

        {/* Inline form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 p-4 border border-border rounded-lg bg-muted/20 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Nova Meta de Bimestre</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Bimestre</label>
                <select
                  value={form.bimestre}
                  onChange={(e) => setForm((prev) => ({ ...prev, bimestre: e.target.value }))}
                  className="w-full text-sm border border-border rounded px-2 py-1.5 bg-background text-foreground"
                  required
                >
                  {BIMESTRES.map((b) => (
                    <option key={b.id} value={b.id}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Meta (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.meta_progresso}
                  onChange={(e) => setForm((prev) => ({ ...prev, meta_progresso: e.target.value }))}
                  placeholder="Ex: 75"
                  className="w-full text-sm border border-border rounded px-2 py-1.5 bg-background text-foreground"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Descrição (opcional)</label>
              <input
                type="text"
                value={form.descricao}
                onChange={(e) => setForm((prev) => ({ ...prev, descricao: e.target.value }))}
                placeholder="Ex: Foco em leitura e interpretação"
                className="w-full text-sm border border-border rounded px-2 py-1.5 bg-background text-foreground"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sala</label>
              <input
                type="text"
                value={form.sala}
                onChange={(e) => setForm((prev) => ({ ...prev, sala: e.target.value }))}
                placeholder="Ex: 3A"
                className="w-full text-sm border border-border rounded px-2 py-1.5 bg-background text-foreground"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="submit" variant="default" size="sm" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Meta'}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeachingPlanPanel;
