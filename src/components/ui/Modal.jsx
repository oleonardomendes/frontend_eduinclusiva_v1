// src/components/ui/Modal.jsx
import React, { useEffect } from "react";
import Icon from "../AppIcon";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={[
          "relative w-full",
          sizeClasses[size],
          "mx-4 sm:mx-6 bg-card text-foreground rounded-2xl shadow-educational border border-border",
          "max-h-[90vh] overflow-hidden",
          className,
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg sm:text-xl font-semibold truncate">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
            aria-label="Fechar"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
``