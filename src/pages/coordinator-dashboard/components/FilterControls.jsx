import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  showClassroomFilter = false 
}) => {
  const gradeOptions = [
    { value: 'all', label: 'Todos os Níveis' },
    { value: 'Infantil', label: 'Educação Infantil' },
    { value: 'Fundamental I', label: 'Fundamental I (1º-5º)' },
    { value: 'Fundamental II', label: 'Fundamental II (6º-9º)' }
  ];

  const classroomOptions = [
    { value: 'all', label: 'Todas as Salas' },
    { value: 'A', label: 'Sala A' },
    { value: 'B', label: 'Sala B' },
    { value: 'C', label: 'Sala C' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativo' },
    { value: 'pending', label: 'Pendente' },
    { value: 'inactive', label: 'Inativo' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'students', label: 'Número de Alunos' },
    { value: 'completion', label: 'Taxa de Conclusão' },
    { value: 'recent', label: 'Atividade Recente' }
  ];

  const hasActiveFilters = filters?.search || 
    filters?.gradeLevel !== 'all' || 
    filters?.classroom !== 'all' ||
    filters?.status !== 'all' || 
    filters?.sortBy !== 'name';

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-educational">
      {/* Search */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Buscar por nome, sala ou professor..."
          value={filters?.search || ''}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
          iconName="Search"
          className="w-full"
        />
      </div>
      {/* Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {/* Grade Level Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nível de Ensino
          </label>
          <Select
            value={filters?.gradeLevel || 'all'}
            onValueChange={(value) => onFilterChange('gradeLevel', value)}
            options={gradeOptions}
          />
        </div>

        {/* Classroom Filter - Only show if enabled */}
        {showClassroomFilter && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Sala
            </label>
            <Select
              value={filters?.classroom || 'all'}
              onValueChange={(value) => onFilterChange('classroom', value)}
              options={classroomOptions}
            />
          </div>
        )}

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <Select
            value={filters?.status || 'all'}
            onValueChange={(value) => onFilterChange('status', value)}
            options={statusOptions}
          />
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Ordenar por
          </label>
          <Select
            value={filters?.sortBy || 'name'}
            onValueChange={(value) => onFilterChange('sortBy', value)}
            options={sortOptions}
          />
        </div>
      </div>
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterControls;