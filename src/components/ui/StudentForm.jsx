// src/components/ui/StudentForm.jsx
import React, { useState, useEffect } from "react";
import Icon from "../AppIcon";
import Button from "./Button";
import Input from "./Input";
import { api } from "../../api/api";

const StudentForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    necessidade: "",
    observacoes: "",
    escola: "",
    sala: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      setError("O nome do aluno é obrigatório.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        idade: formData.idade ? parseInt(formData.idade) : null,
      };

      const { data } = await api.post("/alunos/", payload);
      setSuccess(true);
      if (onSuccess) onSuccess(data);
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 800);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Erro ao cadastrar aluno. Tente novamente.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        className="relative w-full max-w-2xl mx-4 sm:mx-6 bg-card text-foreground rounded-2xl shadow-educational border border-border"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold">Novo Aluno</h2>
            <p className="text-sm text-muted-foreground">
              Cadastre um aluno para gerar planos e atividades com IA
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
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome completo *"
              placeholder="Ex: João Pedro Silva"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              required
            />
            <Input
              label="Idade"
              type="number"
              placeholder="Ex: 8"
              value={formData.idade}
              onChange={(e) => handleChange("idade", e.target.value)}
            />
          </div>

          <Input
            label="Necessidade educacional especial"
            placeholder="Ex: Autismo leve, Dislexia, TDAH..."
            value={formData.necessidade}
            onChange={(e) => handleChange("necessidade", e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Observações
            </label>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              placeholder="Descreva dificuldades específicas, comportamentos, pontos fortes..."
              value={formData.observacoes}
              onChange={(e) => handleChange("observacoes", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Escola"
              placeholder="Ex: EMEF Maria Silva"
              value={formData.escola}
              onChange={(e) => handleChange("escola", e.target.value)}
            />
            <Input
              label="Sala / Turma"
              placeholder="Ex: Sala A - 2º Ano"
              value={formData.sala}
              onChange={(e) => handleChange("sala", e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-100/40 rounded-md p-2 border border-red-200">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 bg-green-100/40 rounded-md p-2 border border-green-200">
              ✅ Aluno cadastrado com sucesso!
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border px-5 py-4 bg-background/60 rounded-b-2xl">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar Aluno"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
