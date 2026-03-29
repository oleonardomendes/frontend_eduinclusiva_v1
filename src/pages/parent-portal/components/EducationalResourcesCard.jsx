import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EducationalResourcesCard = ({ resources }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favoriteResources, setFavoriteResources] = useState(new Set());

  const categories = [
    { id: 'all', name: 'Todos', icon: 'Grid3X3' },
    { id: 'activities', name: 'Atividades', icon: 'Puzzle' },
    { id: 'tips', name: 'Dicas', icon: 'Lightbulb' },
    { id: 'videos', name: 'Vídeos', icon: 'Play' },
    { id: 'articles', name: 'Artigos', icon: 'BookOpen' }
  ];

  const toggleFavorite = (resourceId) => {
    setFavoriteResources(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites?.has(resourceId)) {
        newFavorites?.delete(resourceId);
      } else {
        newFavorites?.add(resourceId);
      }
      return newFavorites;
    });
  };

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources?.filter(resource => resource?.category === selectedCategory);

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return 'Play';
      case 'article':
        return 'FileText';
      case 'activity':
        return 'Puzzle';
      case 'tip':
        return 'Lightbulb';
      default:
        return 'BookOpen';
    }
  };

  const getResourceColor = (type) => {
    switch (type) {
      case 'video':
        return 'text-error';
      case 'article':
        return 'text-primary';
      case 'activity':
        return 'text-success';
      case 'tip':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-educational p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Library" size={24} className="text-primary" />
          <span>Recursos Educacionais</span>
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Star" size={16} />
          <span>{favoriteResources?.size} favoritos</span>
        </div>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-educational ${
              selectedCategory === category?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={category?.icon} size={16} />
            <span>{category?.name}</span>
          </button>
        ))}
      </div>
      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {filteredResources?.map((resource) => (
          <div key={resource?.id} className="border border-border rounded-lg p-4 hover:shadow-educational transition-educational">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                  <Icon 
                    name={getResourceIcon(resource?.type)} 
                    size={20} 
                    className={getResourceColor(resource?.type)} 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{resource?.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource?.category}</p>
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(resource?.id)}
                className="text-muted-foreground hover:text-warning transition-educational"
              >
                <Icon 
                  name={favoriteResources?.has(resource?.id) ? "Star" : "Star"} 
                  size={20} 
                  className={favoriteResources?.has(resource?.id) ? "text-warning fill-current" : ""} 
                />
              </button>
            </div>

            <p className="text-sm text-foreground mb-3">{resource?.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{resource?.duration}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="Users" size={12} />
                  <span>{resource?.ageGroup}</span>
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // In a real app, this would open the resource
                  console.log('Opening resource:', resource?.title);
                }}
              >
                Acessar
              </Button>
            </div>

            {resource?.tags && (
              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border">
                {resource?.tags?.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Quick Tips Section */}
      <div className="border-t border-border pt-6">
        <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Lightbulb" size={20} className="text-warning" />
          <span>Dicas Rápidas para Hoje</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Rotina Estruturada</h4>
            <p className="text-sm text-foreground">
              Mantenha horários fixos para atividades. Crianças com necessidades especiais se beneficiam de rotinas previsíveis.
            </p>
          </div>
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Celebre Pequenas Conquistas</h4>
            <p className="text-sm text-foreground">
              Reconheça e comemore cada progresso, por menor que seja. O reforço positivo é fundamental para o desenvolvimento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalResourcesCard;