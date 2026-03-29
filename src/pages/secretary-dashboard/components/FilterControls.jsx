import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ filters, onFilterChange, onResetFilters }) => {
  const districtOptions = [
    { value: 'all', label: 'Todos os Distritos' },
    { value: 'centro', label: 'Centro' },
    { value: 'norte', label: 'Zona Norte' },
    { value: 'sul', label: 'Zona Sul' },
    { value: 'leste', label: 'Zona Leste' },
    { value: 'oeste', label: 'Zona Oeste' }
  ];

  const schoolTypeOptions = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'municipal', label: 'Escola Municipal' },
    { value: 'emei', label: 'EMEI' },
    { value: 'emef', label: 'EMEF' },
    { value: 'cemei', label: 'CEMEI' }
  ];

  const programOptions = [
    { value: 'all', label: 'Todos os Programas' },
    { value: 'autism', label: 'Transtorno do Espectro Autista' },
    { value: 'intellectual', label: 'Deficiência Intelectual' },
    { value: 'physical', label: 'Deficiência Física' },
    { value: 'visual', label: 'Deficiência Visual' },
    { value: 'hearing', label: 'Deficiência Auditiva' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'excellent', label: 'Excelente' },
    { value: 'good', label: 'Bom' },
    { value: 'attention', label: 'Atenção' },
    { value: 'critical', label: 'Crítico' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-educational mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Filter" size={20} className="mr-2" />
          Filtros de Visualização
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onResetFilters}
          iconName="RotateCcw"
        >
          Limpar Filtros
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Distrito"
          options={districtOptions}
          value={filters?.district}
          onChange={(value) => onFilterChange('district', value)}
          className="w-full"
        />

        <Select
          label="Tipo de Escola"
          options={schoolTypeOptions}
          value={filters?.schoolType}
          onChange={(value) => onFilterChange('schoolType', value)}
          className="w-full"
        />

        <Select
          label="Programa Especial"
          options={programOptions}
          value={filters?.program}
          onChange={(value) => onFilterChange('program', value)}
          className="w-full"
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
          className="w-full"
        />
      </div>
      {/* Active Filters Display */}
      {(filters?.district !== 'all' || filters?.schoolType !== 'all' || filters?.program !== 'all' || filters?.status !== 'all') && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>Filtros ativos aplicados aos resultados</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;