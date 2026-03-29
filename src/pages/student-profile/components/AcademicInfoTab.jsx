import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AcademicInfoTab = ({ student, currentUser, onUpdateAcademicInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: student?.registrationNumber,
    grade: student?.grade,
    class: student?.class,
    teacher: student?.teacher,
    schedule: student?.schedule,
    specialNeeds: student?.specialNeeds,
    accommodations: student?.accommodations,
    learningObjectives: student?.learningObjectives,
    currentLevel: student?.currentLevel
  });

  const canEdit = currentUser?.role === 'teacher' || currentUser?.role === 'coordinator';

  const gradeOptions = [
    { value: '1º Ano', label: '1º Ano do Ensino Fundamental' },
    { value: '2º Ano', label: '2º Ano do Ensino Fundamental' },
    { value: '3º Ano', label: '3º Ano do Ensino Fundamental' },
    { value: '4º Ano', label: '4º Ano do Ensino Fundamental' },
    { value: '5º Ano', label: '5º Ano do Ensino Fundamental' }
  ];

  const scheduleOptions = [
    { value: 'Manhã (7h-12h)', label: 'Manhã (7h-12h)' },
    { value: 'Tarde (13h-18h)', label: 'Tarde (13h-18h)' },
    { value: 'Integral (7h-17h)', label: 'Integral (7h-17h)' }
  ];

  const levelOptions = [
    { value: 'Iniciante', label: 'Iniciante' },
    { value: 'Básico', label: 'Básico' },
    { value: 'Intermediário', label: 'Intermediário' },
    { value: 'Avançado', label: 'Avançado' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onUpdateAcademicInfo(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      registrationNumber: student?.registrationNumber,
      grade: student?.grade,
      class: student?.class,
      teacher: student?.teacher,
      schedule: student?.schedule,
      specialNeeds: student?.specialNeeds,
      accommodations: student?.accommodations,
      learningObjectives: student?.learningObjectives,
      currentLevel: student?.currentLevel
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Informações Acadêmicas</h3>
        {canEdit && !isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            iconName="Edit"
            iconPosition="left"
          >
            Editar
          </Button>
        )}
        {isEditing && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              iconName="Save"
              iconPosition="left"
            >
              Salvar
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground border-b border-border pb-2">
            Informações Escolares
          </h4>

          <Input
            label="Número de Matrícula"
            type="text"
            value={formData?.registrationNumber}
            onChange={(e) => handleInputChange('registrationNumber', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Select
            label="Série/Ano"
            options={gradeOptions}
            value={formData?.grade}
            onChange={(value) => handleInputChange('grade', value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Turma"
            type="text"
            value={formData?.class}
            onChange={(e) => handleInputChange('class', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Ex: A, B, C"
          />

          <Input
            label="Professor(a) Responsável"
            type="text"
            value={formData?.teacher}
            onChange={(e) => handleInputChange('teacher', e?.target?.value)}
            disabled={!isEditing}
          />

          <Select
            label="Horário de Aulas"
            options={scheduleOptions}
            value={formData?.schedule}
            onChange={(value) => handleInputChange('schedule', value)}
            disabled={!isEditing}
            required
          />

          <Select
            label="Nível Atual de Aprendizagem"
            options={levelOptions}
            value={formData?.currentLevel}
            onChange={(value) => handleInputChange('currentLevel', value)}
            disabled={!isEditing}
            required
          />
        </div>

        {/* Special Needs and Accommodations */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground border-b border-border pb-2">
            Necessidades Especiais e Acomodações
          </h4>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Necessidades Especiais</label>
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {formData?.specialNeeds?.map((need, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              ) : (
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  rows={3}
                  value={formData?.specialNeeds?.join(', ')}
                  onChange={(e) => handleInputChange('specialNeeds', e?.target?.value?.split(', '))}
                  placeholder="Digite as necessidades especiais separadas por vírgula"
                />
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Acomodações Necessárias</label>
            <textarea
              className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              rows={4}
              value={formData?.accommodations}
              onChange={(e) => handleInputChange('accommodations', e?.target?.value)}
              disabled={!isEditing}
              placeholder="Descreva as acomodações necessárias para o aprendizado..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Objetivos de Aprendizagem</label>
            <textarea
              className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              rows={4}
              value={formData?.learningObjectives}
              onChange={(e) => handleInputChange('learningObjectives', e?.target?.value)}
              disabled={!isEditing}
              placeholder="Defina os objetivos específicos de aprendizagem para este aluno..."
            />
          </div>
        </div>
      </div>
      {/* Academic Performance Summary */}
      {!isEditing && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Target" size={20} className="text-primary mt-0.5" />
            <div className="flex-1">
              <h5 className="text-sm font-medium text-foreground">Resumo do Desempenho Acadêmico</h5>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Progresso Geral</p>
                  <p className="font-medium text-primary">{student?.overallProgress}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Última Avaliação</p>
                  <p className="font-medium text-foreground">{student?.lastAssessment}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Próxima Revisão</p>
                  <p className="font-medium text-foreground">15/11/2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicInfoTab;