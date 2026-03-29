import React from 'react';
import Icon from '../../../components/AppIcon';

const StudentProgressCard = ({ student }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getProgressBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-educational p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="User" size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{student?.name}</h2>
            <p className="text-sm text-muted-foreground">{student?.class} • {student?.school}</p>
            <p className="text-xs text-muted-foreground">Necessidades: {student?.specialNeeds}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{student?.overallProgress}%</p>
          <p className="text-sm text-muted-foreground">Progresso Geral</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {student?.subjects?.map((subject) => (
          <div key={subject?.name} className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-foreground">{subject?.name}</h3>
              <span className={`text-sm font-semibold ${getProgressColor(subject?.progress)}`}>
                {subject?.progress}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(subject?.progress)}`}
                style={{ width: `${subject?.progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{subject?.status}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-4">
        <h3 className="font-medium text-foreground mb-3">Atividades Recentes</h3>
        <div className="space-y-2">
          {student?.recentActivities?.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${activity?.completed ? 'bg-success' : 'bg-warning'}`} />
                <span className="text-sm text-foreground">{activity?.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{activity?.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgressCard;