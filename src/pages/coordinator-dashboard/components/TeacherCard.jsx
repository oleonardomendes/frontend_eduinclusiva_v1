import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TeacherCard = ({ teacher }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-educational hover-scale transition-educational">
      {/* Teacher Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={teacher?.avatar}
              alt={teacher?.avatarAlt}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(teacher?.status)}`} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{teacher?.name}</h3>
            <p className="text-sm text-muted-foreground">{teacher?.specialization}</p>
            <p className="text-xs text-muted-foreground">{teacher?.gradeLevel}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          iconName="MessageSquare"
          className="text-muted-foreground hover:text-foreground"
        />
      </div>
      {/* Statistics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg mx-auto mb-1">
            <Icon name="Users" size={16} className="text-primary" />
          </div>
          <p className="text-lg font-semibold text-foreground">{teacher?.totalStudents}</p>
          <p className="text-xs text-muted-foreground">Alunos</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-secondary/10 rounded-lg mx-auto mb-1">
            <Icon name="BookOpen" size={16} className="text-secondary" />
          </div>
          <p className="text-lg font-semibold text-foreground">{teacher?.activePlans}</p>
          <p className="text-xs text-muted-foreground">Planos</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-accent/10 rounded-lg mx-auto mb-1">
            <Icon name="TrendingUp" size={16} className="text-accent" />
          </div>
          <p className={`text-lg font-semibold ${getCompletionColor(teacher?.completionRate)}`}>
            {teacher?.completionRate}%
          </p>
          <p className="text-xs text-muted-foreground">Conclusão</p>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Atividade Recente</h4>
        <div className="space-y-2">
          {teacher?.recentActivities?.slice(0, 2)?.map((activity, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-muted-foreground truncate flex-1">{activity?.description}</span>
              <span className="text-muted-foreground">{activity?.time}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Link to="/teacher-dashboard" className="flex-1">
          <Button variant="outline" size="sm" className="w-full" iconName="Eye">
            Ver Dashboard
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          iconName="FileText"
          className="text-muted-foreground hover:text-foreground"
        >
          Relatórios
        </Button>
      </div>
    </div>
  );
};

export default TeacherCard;