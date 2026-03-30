import React, { useEffect } from "react";
import Icon from "../AppIcon";

/**
 * Modal controlado
 * - Renderiza somente quando open === true
 * - Fecha em overlay, botão X e tecla ESC
 */
export default function Modal({
  open = false,
  onClose = () => {},
  title = "Detalhes",
  size = "md",
  className = "",
  children,
}) {
  // não renderiza nada quando fechado
  if (!open) return null;

  // Bloquear scroll do body somente quando aberto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev || "auto";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}                // clique no overlay fecha
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} mx-4 sm:mx-6 bg-card text-foreground rounded-2xl shadow-educational border border-border animate-scale-in ${className}`}
        onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg sm:text-xl font-semibold truncate text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
            aria-label="Fechar"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}
