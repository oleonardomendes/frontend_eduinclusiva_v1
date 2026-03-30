// src/components/ui/Modal.jsx
import React, { useEffect } from "react";
import Icon from "../AppIcon";

/**
 * Modal controlado:
 * - Só renderiza quando open === true
 * - Fecha no overlay, no X e com tecla ESC
 * - Limita altura e faz scroll interno (não fica maior que a tela)
 */
export default function Modal({
  open = false,
  onClose = () => {},
  title = "Detalhes",
  size = "md",
  className = "",
  children,
}) {
  if (!open) return null;

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
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={[
          "relative w-full",
          sizeClasses[size],
          "mx-4 sm:mx-6 bg-card text-foreground rounded-2xl shadow-educational border border-border animate-scale-in",
          "max-h-[90vh] overflow-hidden", // limita altura do container
          className,
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
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

        {/* Body com scroll interno */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}