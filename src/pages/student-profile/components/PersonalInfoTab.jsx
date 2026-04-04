import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

function MedicalInfoDisplay({ value }) {
  if (!value) return <p className="text-sm text-muted-foreground">—</p>;
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (parsed && typeof parsed === 'object') {
      return (
        <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border text-sm">
          {parsed.diagnostico && (
            <p>
              <span className="font-medium text-foreground">Diagnóstico: </span>
              <span className="text-muted-foreground">{parsed.diagnostico}</span>
            </p>
          )}
          {parsed.alergias && (
            <p>
              <span className="font-medium text-foreground">Alergias: </span>
              <span className="text-muted-foreground">{parsed.alergias}</span>
            </p>
          )}
          {parsed.medicamentos && (
            <p>
              <span className="font-medium text-foreground">Medicamentos: </span>
              <span className="text-muted-foreground">{parsed.medicamentos}</span>
            </p>
          )}
        </div>
      );
    }
  } catch {
    // JSON inválido — exibe como texto simples
  }
  return (
    <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg border border-border">
      {value}
    </p>
  );
}

const PersonalInfoTab = ({ student, currentUser, onUpdateStudent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: student?.name,
    birthDate: student?.birthDate,
    gender: student?.gender,
    address: student?.address,
    phone: student?.phone,
    emergencyContact: student?.emergencyContact,
    medicalInfo: student?.medicalInfo,
    allergies: student?.allergies,
    medications: student?.medications
  });

  const canEdit = currentUser?.role === 'teacher' || currentUser?.role === 'coordinator';

  const genderOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'outro', label: 'Outro' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onUpdateStudent(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: student?.name,
      birthDate: student?.birthDate,
      gender: student?.gender,
      address: student?.address,
      phone: student?.phone,
      emergencyContact: student?.emergencyContact,
      medicalInfo: student?.medicalInfo,
      allergies: student?.allergies,
      medications: student?.medications
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Informações Pessoais</h3>
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
      {/* Personal Information Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground border-b border-border pb-2">
            Dados Básicos
          </h4>
          
          <Input
            label="Nome Completo"
            type="text"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Data de Nascimento"
            type="date"
            value={formData?.birthDate}
            onChange={(e) => handleInputChange('birthDate', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Select
            label="Gênero"
            options={genderOptions}
            value={formData?.gender}
            onChange={(value) => handleInputChange('gender', value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Endereço Residencial"
            type="text"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Rua, número, bairro, cidade"
          />

          <Input
            label="Telefone de Contato"
            type="tel"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            disabled={!isEditing}
            placeholder="(11) 99999-9999"
          />
        </div>

        {/* Emergency and Medical Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground border-b border-border pb-2">
            Contato de Emergência e Informações Médicas
          </h4>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Contato de Emergência</label>
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="grid grid-cols-1 gap-3">
                <Input
                  label="Nome"
                  type="text"
                  value={formData?.emergencyContact?.name || ''}
                  onChange={(e) => handleInputChange('emergencyContact', {
                    ...formData?.emergencyContact,
                    name: e?.target?.value
                  })}
                  disabled={!isEditing}
                  placeholder="Nome do responsável"
                />
                <Input
                  label="Telefone"
                  type="tel"
                  value={formData?.emergencyContact?.phone || ''}
                  onChange={(e) => handleInputChange('emergencyContact', {
                    ...formData?.emergencyContact,
                    phone: e?.target?.value
                  })}
                  disabled={!isEditing}
                  placeholder="(11) 99999-9999"
                />
                <Input
                  label="Parentesco"
                  type="text"
                  value={formData?.emergencyContact?.relationship || ''}
                  onChange={(e) => handleInputChange('emergencyContact', {
                    ...formData?.emergencyContact,
                    relationship: e?.target?.value
                  })}
                  disabled={!isEditing}
                  placeholder="Mãe, pai, avó, etc."
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Informações Médicas</label>
            {isEditing ? (
              <textarea
                className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                rows={3}
                value={formData?.medicalInfo}
                onChange={(e) => handleInputChange('medicalInfo', e?.target?.value)}
                placeholder="Condições médicas relevantes para o aprendizado..."
              />
            ) : (
              <MedicalInfoDisplay value={formData?.medicalInfo} />
            )}
          </div>

          <Input
            label="Alergias"
            type="text"
            value={formData?.allergies}
            onChange={(e) => handleInputChange('allergies', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Alergias alimentares ou medicamentosas"
          />

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Medicamentos em Uso</label>
            <textarea
              className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              rows={3}
              value={formData?.medications}
              onChange={(e) => handleInputChange('medications', e?.target?.value)}
              disabled={!isEditing}
              placeholder="Medicamentos, dosagens e horários..."
            />
          </div>
        </div>
      </div>
      {/* Important Notes */}
      {!isEditing && (
        <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-accent mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-foreground">Informações Importantes</h5>
              <p className="text-sm text-muted-foreground mt-1">
                Mantenha sempre atualizadas as informações de contato e médicas para garantir 
                o melhor atendimento ao estudante em situações de emergência.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoTab;