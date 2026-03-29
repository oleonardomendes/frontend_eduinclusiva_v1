import React, { useState, useEffect } from "react";
import Icon from "../AppIcon";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import { createActivity } from "../../api/activities";

const DialogForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    difficulty: "",
    targetAge: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await createActivity(formData);
      setSuccess(true);
      if (onSuccess) onSuccess(result);
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error(err);
      setError("Erro ao criar atividade. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <form
        className="relative w-full max-w-2xl mx-4 sm:mx-6 bg-card text-foreground rounded-2xl shadow-educational border border-border animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold">Nova Atividade</h2>
            <p className="text-sm text-muted-foreground">
              Crie uma atividade personalizada para seus alunos
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <Input
            label="Título"
            placeholder="Ex: Leitura de Palavras Simples"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <Input
            label="Descrição"
            placeholder="Descreva brevemente a atividade"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <Select
            label="Categoria"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            options={["Português", "Matemática", "Ciências", "Arte", "Socialização"]}
          />

          <Input
            label="Duração (minutos)"
            type="number"
            placeholder="Ex: 30"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
          />

          <Select
            label="Nível de Dificuldade"
            value={formData.difficulty}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            options={["Fácil", "Médio", "Difícil"]}
          />

          <Input
            label="Faixa Etária"
            placeholder="Ex: 6-8 anos"
            value={formData.targetAge}
            onChange={(e) => handleChange("targetAge", e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 bg-red-100/40 rounded-md p-2 border border-red-200">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 bg-green-100/40 rounded-md p-2 border border-green-200">
              Atividade criada com sucesso!
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border px-5 py-4 bg-background/60 backdrop-blur-sm rounded-b-2xl">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Atividade"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DialogForm;
