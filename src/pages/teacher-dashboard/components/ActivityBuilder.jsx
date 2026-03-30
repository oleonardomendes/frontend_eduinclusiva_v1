// src/pages/teacher-dashboard/components/ActivityBuilder.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';

export default function ActivityBuilder({ isOpen, onClose, onSave }) {
  const [activityData, setActivityData] = useState({
    title: '',
    description: '',
    category: 'Matemática',
    difficulty: 'Fácil',
    duration: '30',
    targetAge: '6-8 anos',
    objectives: [''],
    materials: [''],
    instructions: [''],
    adaptations: [''],
    assessmentCriteria: [''],
  });

  const categories = ['Matemática', 'Português', 'Ciências', 'Arte', 'Educação Física', 'Socialização'];
  const difficulties = ['Fácil', 'Médio', 'Difícil'];
  const ageRanges = ['4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12+ anos'];

  function handleInputChange(field, value) {
    setActivityData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleArrayChange(field, index, value) {
    setActivityData((prev) => ({
      ...prev,
      [field]: prev?.[field]?.map((item, i) => (i === index ? value : item)),
    }));
  }

  function addArrayItem(field) {
    setActivityData((prev) => ({
      ...prev,
      [field]: [...(prev?.[field] || []), ''],
    }));
  }

  function removeArrayItem(field, index) {
    setActivityData((prev) => ({
      ...prev,
      [field]: (prev?.[field] || []).filter((_, i) => i !== index),
    }));
  }

  function handleClose() {
    // Se quiser limpar ao fechar, descomente:
    // setActivityData({ ...activityData, title: '', description: '' });
    onClose?.();
  }

  function handleSave(e) {
    e?.preventDefault();

    // Validação mínima
    if (!activityData?.title?.trim() || !activityData?.description?.trim()) {
      alert('Por favor, preencha o título e a descrição da atividade.');
      return;
    }

    // Limpeza de itens vazios nos arrays
    const cleanedData = {
      ...activityData,
      objectives: (activityData?.objectives || []).filter((v) => v?.trim()),
      materials: (activityData?.materials || []).filter((v) => v?.trim()),
      instructions: (activityData?.instructions || []).filter((v) => v?.trim()),
      adaptations: (activityData?.adaptations || []).filter((v) => v?.trim()),
      assessmentCriteria: (activityData?.assessmentCriteria || []).filter((v) => v?.trim()),
    };

    // Retorna para o pai
    onSave?.(cleanedData);
    onClose?.(); // ✅ fecha ao salvar
  }

  return (
    <Modal open={isOpen} onClose={handleClose} title="Nova Atividade" size="lg">
      {/* Header adicional (opcional) — o título já está no Modal */}
      {/* <div className="mb-2 text-sm text-muted-foreground">
        Crie uma atividade personalizada para seus alunos
      </div> */}

      <form onSubmit={handleSave} className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {/* Informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Título da Atividade"
            type="text"
            placeholder="Ex: Leitura de Palavras Simples"
            value={activityData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Categoria</label>
            <select
              value={activityData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Dificuldade</label>
            <select
              value={activityData.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Duração (minutos)"
            type="number"
            placeholder="30"
            value={activityData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            min={1}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Faixa Etária</label>
            <select
              value={activityData.targetAge}
              onChange={(e) => handleInputChange('targetAge', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {ageRanges.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Descrição</label>
          <textarea
            value={activityData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descreva brevemente a atividade..."
            rows={3}
            className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            required
          />
        </div>

        {/* Seções dinâmicas */}
        {[
          { field: 'objectives', title: 'Objetivos de Aprendizagem', icon: 'Target' },
          { field: 'materials', title: 'Materiais Necessários', icon: 'Package' },
          { field: 'instructions', title: 'Instruções Passo a Passo', icon: 'List' },
          { field: 'adaptations', title: 'Adaptações para Necessidades Especiais', icon: 'Heart' },
          { field: 'assessmentCriteria', title: 'Critérios de Avaliação', icon: 'CheckCircle' },
        ].map(({ field, title, icon }) => (
          <div key={field} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground flex items-center">
                <Icon name={icon} size={16} className="mr-2 text-primary" />
                {title}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(field)}
                iconName="Plus"
              >
                Adicionar
              </Button>
            </div>

            <div className="space-y-2">
              {(activityData?.[field] || []).map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(field, index, e.target.value)}
                    placeholder={`${title.toLowerCase()} ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {(activityData?.[field]?.length || 0) > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem(field, index)}
                      aria-label="Remover item"
                    >
                      <Icon name="Trash2" size={16} className="text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer do formulário */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="default">
            Salvar Atividade
          </Button>
        </div>
      </form>
    </Modal>
  );
}
``