// src/components/ui/AtividadeModal.jsx
import React from "react";
import Modal from "./Modal";
import Icon from "../AppIcon";
import Button from "./Button";

function DifficultyBadge({ dificuldade }) {
  const map = {
    fácil: "bg-success/10 text-success border-success/20",
    facil: "bg-success/10 text-success border-success/20",
    médio: "bg-warning/10 text-warning border-warning/20",
    medio: "bg-warning/10 text-warning border-warning/20",
    difícil: "bg-destructive/10 text-destructive border-destructive/20",
    dificil: "bg-destructive/10 text-destructive border-destructive/20",
  };
  const key = dificuldade?.toLowerCase?.() || "";
  const cls = map[key] || "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {dificuldade}
    </span>
  );
}

function Badge({ children, icon }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}

function Section({ iconName, iconClass = "text-primary", title, children }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
        <Icon name={iconName} size={15} className={iconClass} />
        {title}
      </h4>
      {children}
    </div>
  );
}

function OrderedList({ items }) {
  if (!Array.isArray(items) || items.length === 0) return <p className="text-sm text-muted-foreground">—</p>;
  return (
    <ol className="space-y-1.5 list-none">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-foreground">
          <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span>{typeof item === "string" ? item : item?.descricao || item?.texto || JSON.stringify(item)}</span>
        </li>
      ))}
    </ol>
  );
}

function IconList({ items, iconName, iconClass }) {
  if (!Array.isArray(items) || items.length === 0) return <p className="text-sm text-muted-foreground">—</p>;
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-foreground">
          <Icon name={iconName} size={14} className={`shrink-0 mt-0.5 ${iconClass}`} />
          <span>{typeof item === "string" ? item : item?.descricao || item?.texto || JSON.stringify(item)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AtividadeModal({ atividade, onClose }) {
  if (!atividade) return null;

  const {
    titulo,
    objetivo,
    duracao,
    dificuldade,
    bimestre,
    passo_a_passo,
    materiais,
    adaptacoes,
    criterios_avaliacao,
    justificativa,
  } = atividade;

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={titulo || "Atividade Gerada por IA"}
      size="lg"
    >
      <div className="space-y-6">
        {/* Badges de meta-dados */}
        <div className="flex flex-wrap gap-2">
          {dificuldade && <DifficultyBadge dificuldade={dificuldade} />}
          {duracao && <Badge icon="Clock">{duracao}</Badge>}
          {bimestre && <Badge icon="Calendar">{`${bimestre}º Bimestre`}</Badge>}
        </div>

        {/* Objetivo */}
        {objetivo && (
          <Section iconName="Target" title="Objetivo">
            <p className="text-sm text-foreground leading-relaxed">{objetivo}</p>
          </Section>
        )}

        {/* Passo a passo */}
        <Section iconName="ListOrdered" title="Passo a Passo">
          <OrderedList items={passo_a_passo} />
        </Section>

        {/* Materiais */}
        <Section iconName="Package" iconClass="text-secondary" title="Materiais Necessários">
          <IconList items={materiais} iconName="Dot" iconClass="text-secondary" />
        </Section>

        {/* Adaptações */}
        <Section iconName="Heart" iconClass="text-rose-500" title="Adaptações">
          <IconList items={adaptacoes} iconName="Heart" iconClass="text-rose-400" />
        </Section>

        {/* Critérios de avaliação */}
        <Section iconName="ClipboardCheck" iconClass="text-success" title="Critérios de Avaliação">
          <IconList items={criterios_avaliacao} iconName="CheckCircle" iconClass="text-success" />
        </Section>

        {/* Justificativa */}
        {justificativa && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
              <Icon name="Info" size={13} />
              Justificativa Pedagógica
            </p>
            <p className="text-sm text-foreground leading-relaxed">{justificativa}</p>
          </div>
        )}

        {/* Ações */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={() => alert("Exportar PDF — em breve!")}
          >
            Salvar PDF
          </Button>
          <Button variant="default" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
