// src/components/ui/AtividadeModal.jsx
import React from "react";
import Modal from "./Modal";
import Icon from "../AppIcon";
import Button from "./Button";

const FONTE_CONFIG = {
  ia_nova:        { emoji: "✨", label: "Gerada por IA", cls: "bg-purple-100 text-purple-700 border-purple-200" },
  ia_reutilizada: { emoji: "♻️", label: "Reutilizada",   cls: "bg-blue-100 text-blue-700 border-blue-200"     },
  template:       { emoji: "📚", label: "Template",      cls: "bg-green-100 text-green-700 border-green-200"  },
};

const DIFICULDADE_CLS = {
  "fácil":  "bg-green-100 text-green-700 border-green-200",
  "facil":  "bg-green-100 text-green-700 border-green-200",
  "médio":  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "medio":  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "difícil":"bg-red-100 text-red-700 border-red-200",
  "dificil":"bg-red-100 text-red-700 border-red-200",
};

function PillBadge({ icon, children, cls }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {icon && <Icon name={icon} size={11} />}
      {children}
    </span>
  );
}

function SectionCard({ iconName, iconClass, title, bg = "bg-muted/30", children }) {
  return (
    <div className={`rounded-lg p-4 ${bg}`}>
      <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
        <Icon name={iconName} size={15} className={iconClass} />
        {title}
      </h4>
      {children}
    </div>
  );
}

function TextBlock({ iconName, iconClass, title, bg, text, preWrap, italic }) {
  if (!text) return null;
  return (
    <SectionCard iconName={iconName} iconClass={iconClass} title={title} bg={bg}>
      <p className={`text-sm text-foreground leading-relaxed${preWrap ? " whitespace-pre-line" : ""}${italic ? " italic" : ""}`}>
        {text}
      </p>
    </SectionCard>
  );
}

function ListBlock({ iconName, iconClass, title, bg, items, prefix }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const toStr = (item) =>
    typeof item === "string" ? item : item?.texto || item?.descricao || JSON.stringify(item);

  return (
    <SectionCard iconName={iconName} iconClass={iconClass} title={title} bg={bg}>
      {prefix === "number" ? (
        <ol className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span>{toStr(item)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground">
              <span className="shrink-0 mt-0.5 leading-none text-base">{prefix}</span>
              <span>{toStr(item)}</span>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

export default function AtividadeModal({ atividade, fonte, onClose }) {
  if (!atividade) return null;

  const {
    titulo,
    objetivo,
    instrucao_professor,
    instrucao_familia,
    conteudo_atividade,
    passo_a_passo,
    materiais,
    adaptacoes,
    criterios_avaliacao,
    justificativa,
    dificuldade,
    bimestre,
    materia,
    duracao_minutos,
  } = atividade;

  const difKey = dificuldade?.toLowerCase?.() || "";
  const difCls = DIFICULDADE_CLS[difKey] || "bg-gray-100 text-gray-600 border-gray-200";
  const fonteConfig = fonte ? FONTE_CONFIG[fonte] : null;

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={titulo || "Atividade Gerada por IA"}
      size="lg"
    >
      <div className="space-y-5">

        {/* ── Badges de meta-dados ── */}
        <div className="flex flex-wrap gap-2">
          {dificuldade && (
            <PillBadge cls={difCls}>{dificuldade}</PillBadge>
          )}
          {bimestre && (
            <PillBadge icon="Calendar" cls="bg-muted text-muted-foreground border-border">
              {bimestre}º Bimestre
            </PillBadge>
          )}
          {materia && (
            <PillBadge icon="BookOpen" cls="bg-muted text-muted-foreground border-border">
              {materia}
            </PillBadge>
          )}
          {duracao_minutos && (
            <PillBadge icon="Clock" cls="bg-muted text-muted-foreground border-border">
              {duracao_minutos} min
            </PillBadge>
          )}
          {fonteConfig && (
            <PillBadge cls={fonteConfig.cls}>
              {fonteConfig.emoji} {fonteConfig.label}
            </PillBadge>
          )}
        </div>

        {/* ── 1. Objetivo ── */}
        <TextBlock
          iconName="Target" iconClass="text-primary"
          title="Objetivo"
          text={objetivo}
        />

        {/* ── 2. Instrução para o Professor ── */}
        <TextBlock
          iconName="BookOpen" iconClass="text-blue-600"
          title="Instrução para o Professor"
          bg="bg-blue-50"
          text={instrucao_professor}
        />

        {/* ── 3. Instrução para a Família ── */}
        <TextBlock
          iconName="Home" iconClass="text-green-600"
          title="Instrução para a Família"
          bg="bg-green-50"
          text={instrucao_familia}
        />

        {/* ── 4. Conteúdo da Atividade ── */}
        {conteudo_atividade && (
          <SectionCard iconName="FileText" iconClass="text-gray-500" title="Conteúdo da Atividade" bg="bg-gray-50">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {conteudo_atividade}
            </p>
          </SectionCard>
        )}

        {/* ── 5. Passo a Passo ── */}
        <ListBlock
          iconName="List" iconClass="text-primary"
          title="Passo a Passo"
          items={passo_a_passo}
          prefix="number"
        />

        {/* ── 6. Materiais Necessários ── */}
        <ListBlock
          iconName="Package" iconClass="text-secondary"
          title="Materiais Necessários"
          items={materiais}
          prefix="•"
        />

        {/* ── 7. Adaptações ── */}
        <ListBlock
          iconName="Heart" iconClass="text-rose-500"
          title="Adaptações"
          items={adaptacoes}
          prefix="♡"
        />

        {/* ── 8. Critérios de Avaliação ── */}
        <ListBlock
          iconName="CheckCircle" iconClass="text-green-600"
          title="Critérios de Avaliação"
          items={criterios_avaliacao}
          prefix="✓"
        />

        {/* ── 9. Justificativa ── */}
        {justificativa && (
          <SectionCard iconName="Info" iconClass="text-yellow-600" title="Justificativa" bg="bg-yellow-50">
            <p className="text-sm text-foreground leading-relaxed italic">{justificativa}</p>
          </SectionCard>
        )}

        {/* ── Footer ── */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="default" size="sm" iconName="Printer" iconPosition="left" onClick={() => window.print()}>
            Imprimir
          </Button>
        </div>
      </div>
    </Modal>
  );
}
