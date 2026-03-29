import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ActivityBuilder = ({ isOpen, onClose, onSave }) => {
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
    assessmentCriteria: ['']
  });

  const categories = ['Matemática', 'Português', 'Ciências', 'Arte', 'Educação Física', 'Socialização'];
  const difficulties = ['Fácil', 'Médio', 'Difícil'];
  const ageRanges = ['4-6 anos', '6-8 anos', '8-10 anos', '10-12 anos', '12+ anos'];

  const handleInputChange = (field, value) => {
    setActivityData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setActivityData(prev => ({
      ...prev,
      [field]: prev?.[field]?.map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setActivityData(prev => ({
      ...prev,
      [field]: [...prev?.[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setActivityData(prev => ({
      ...prev,
      [field]: prev?.[field]?.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!activityData?.title || !activityData?.description) {
      alert('Por favor, preencha o título e a descrição da atividade.');
      return;
    }

    // Clean up empty array items
    const cleanedData = {
      ...activityData,
      objectives: activityData?.objectives?.filter(obj => obj?.trim()),
      materials: activityData?.materials?.filter(mat => mat?.trim()),
      instructions: activityData?.instructions?.filter(inst => inst?.trim()),
      adaptations: activityData?.adaptations?.filter(adapt => adapt?.trim()),
      assessmentCriteria: activityData?.assessmentCriteria?.filter(crit => crit?.trim())
    };

    onSave(cleanedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-card border border-border rounded-lg shadow-educational-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Construtor de Atividades</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Título da Atividade"
                type="text"
                placeholder="Digite o título da atividade"
                value={activityData?.title}
                onChange={(e) => handleInputChange('title', e?.target?.value)}
                required
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Categoria</label>
                <select
                  value={activityData?.category}
                  onChange={(e) => handleInputChange('category', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {categories?.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Dificuldade</label>
                <select
                  value={activityData?.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {difficulties?.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Duração (minutos)"
                type="number"
                placeholder="30"
                value={activityData?.duration}
                onChange={(e) => handleInputChange('duration', e?.target?.value)}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Faixa Etária</label>
                <select
                  value={activityData?.targetAge}
                  onChange={(e) => handleInputChange('targetAge', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {ageRanges?.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <textarea
                value={activityData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                placeholder="Descreva a atividade e seus benefícios..."
                rows={3}
                className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                required
              />
            </div>

            {/* Dynamic Sections */}
            {[
              { field: 'objectives', title: 'Objetivos de Aprendizagem', icon: 'Target' },
              { field: 'materials', title: 'Materiais Necessários', icon: 'Package' },
              { field: 'instructions', title: 'Instruções Passo a Passo', icon: 'List' },
              { field: 'adaptations', title: 'Adaptações para Necessidades Especiais', icon: 'Heart' },
              { field: 'assessmentCriteria', title: 'Critérios de Avaliação', icon: 'CheckCircle' }
            ]?.map(({ field, title, icon }) => (
              <div key={field} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground flex items-center">
                    <Icon name={icon} size={16} className="mr-2 text-primary" />
                    {title}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem(field)}
                    iconName="Plus"
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {activityData?.[field]?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange(field, index, e?.target?.value)}
                        placeholder={`${title?.toLowerCase()} ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      {activityData?.[field]?.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem(field, index)}
                        >
                          <Icon name="Trash2" size={16} className="text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleSave}>
            Salvar Atividade
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityBuilder;