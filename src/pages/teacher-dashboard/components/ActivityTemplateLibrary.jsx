import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function ActivityTemplateLibrary({ templates = [], onSelectTemplate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Matemática', 'Português', 'Ciências', 'Arte', 'Educação Física', 'Socialização'];

  const filteredTemplates = (templates || []).filter((template) => {
    const s = String(searchTerm || '').toLowerCase();
    const title = String(template?.title || '').toLowerCase();
    const desc = String(template?.description || '').toLowerCase();
    const matchesSearch = title.includes(s) || desc.includes(s);
    const matchesCategory = selectedCategory === 'Todos' || template?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Fácil': 'bg-green-100 text-green-800',
      'Médio': 'bg-yellow-100 text-yellow-800',
      'Difícil': 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Matemática': 'Calculator',
      'Português': 'BookOpen',
      'Ciências': 'Microscope',
      'Arte': 'Palette',
      'Educação Física': 'Activity',
      'Socialização': 'Users',
    };
    return icons[category] || 'FileText';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-educational">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Biblioteca de Atividades</h2>
          <Button type="button" variant="default" size="sm" iconName="Plus" onClick={() => { /* futuro: criar template */ }}>
            Criar Template
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <Input
            type="search"
            placeholder="Buscar atividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm rounded-full transition-educational ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="p-6">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma atividade encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template?.id} className="border border-border rounded-lg p-4 hover-scale transition-educational">
                {/* Template Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={getCategoryIcon(template?.category)} size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground truncate">{template?.title}</h3>
                      <p className="text-xs text-muted-foreground">{template?.category}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template?.difficulty)}`}>
                    {template?.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {template?.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="flex items-center">
                    <Icon name="Clock" size={12} className="mr-1" />
                    {template?.duration}
                  </span>
                  <span className="flex items-center">
                    <Icon name="Users" size={12} className="mr-1" />
                    {template?.targetAge}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(template?.tags || []).slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                  {(template?.tags?.length || 0) > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => onSelectTemplate?.(template)}
                    className="flex-1"
                  >
                    Usar Template
                  </Button>
                  <Button type="button" variant="outline" size="sm" iconName="Eye">
                    Visualizar
                  </Button>
                </div>

                {/* Usage Stats */}
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Icon name="ThumbsUp" size={12} className="mr-1" />
                      {template?.likes} curtidas
                    </span>
                    <span className="flex items-center">
                      <Icon name="Download" size={12} className="mr-1" />
                      {template?.downloads} usos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}