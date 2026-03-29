import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HomeActivitiesCard = ({ activities }) => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [completedActivities, setCompletedActivities] = useState(new Set());

  const markAsCompleted = (activityId) => {
    setCompletedActivities(prev => new Set([...prev, activityId]));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-success/10 text-success';
      case 'Médio':
        return 'bg-warning/10 text-warning';
      case 'Difícil':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-educational p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Home" size={24} className="text-primary" />
          <span>Atividades para Casa</span>
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Target" size={16} />
          <span>{activities?.length} atividades</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {activities?.map((activity) => (
          <div 
            key={activity?.id} 
            className={`border rounded-lg p-4 cursor-pointer transition-educational hover:shadow-educational ${
              selectedActivity?.id === activity?.id ? 'border-primary bg-primary/5' : 'border-border'
            } ${completedActivities?.has(activity?.id) ? 'opacity-60' : ''}`}
            onClick={() => setSelectedActivity(activity)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">{activity?.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{activity?.subject}</p>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity?.difficulty)}`}>
                    {activity?.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{activity?.duration}</span>
                  </span>
                </div>
              </div>
              {completedActivities?.has(activity?.id) && (
                <Icon name="CheckCircle" size={20} className="text-success" />
              )}
            </div>
            
            <p className="text-sm text-foreground mb-3">{activity?.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Objetivo: {activity?.objective}
              </span>
              <Button
                size="sm"
                variant={completedActivities?.has(activity?.id) ? "secondary" : "outline"}
                onClick={(e) => {
                  e?.stopPropagation();
                  if (!completedActivities?.has(activity?.id)) {
                    markAsCompleted(activity?.id);
                  }
                }}
                disabled={completedActivities?.has(activity?.id)}
              >
                {completedActivities?.has(activity?.id) ? 'Concluída' : 'Marcar como Feita'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {selectedActivity && (
        <div className="border-t border-border pt-6">
          <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="BookOpen" size={20} className="text-primary" />
            <span>Instruções Detalhadas: {selectedActivity?.title}</span>
          </h3>
          
          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-foreground mb-2">Materiais Necessários:</h4>
            <ul className="list-disc list-inside text-sm text-foreground space-y-1">
              {selectedActivity?.materials?.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Passo a Passo:</h4>
            <ol className="list-decimal list-inside text-sm text-foreground space-y-2">
              {selectedActivity?.steps?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {selectedActivity?.tips && (
            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                <Icon name="Lightbulb" size={16} className="text-primary" />
                <span>Dicas Importantes:</span>
              </h4>
              <p className="text-sm text-foreground">{selectedActivity?.tips}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeActivitiesCard;