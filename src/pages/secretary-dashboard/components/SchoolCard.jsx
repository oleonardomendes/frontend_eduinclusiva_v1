import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SchoolCard = ({ school }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return 'CheckCircle';
      case 'good':
        return 'ThumbsUp';
      case 'attention':
        return 'AlertTriangle';
      case 'critical':
        return 'AlertCircle';
      default:
        return 'Info';
    }
  };

  const handleViewSchoolDetails = () => {
    // Navigate to coordinator dashboard for this specific school
    navigate(`/coordinator-dashboard/${school?.id}`);
  };

  const handleViewStudents = () => {
    // Navigate to coordinator dashboard focused on students view
    navigate(`/coordinator-dashboard/${school?.id}`, { 
      state: { focusStudents: true } 
    });
  };

  const handleViewEvolution = () => {
    // Navigate to coordinator dashboard focused on evolution metrics
    navigate(`/coordinator-dashboard/${school?.id}`, { 
      state: { focusEvolution: true } 
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-educational hover-scale transition-educational">
      {/* School Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1 cursor-pointer hover:text-primary transition-colors" onClick={handleViewSchoolDetails}>
            {school?.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {school?.address}
          </p>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(school?.status)}`}>
            <Icon name={getStatusIcon(school?.status)} size={12} className="mr-1" />
            {school?.statusLabel}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {school?.hasAlerts && (
            <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
              <Icon name="Bell" size={14} className="text-red-600" />
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={handleViewSchoolDetails}>
            <Icon name="ExternalLink" size={16} />
          </Button>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="text-center cursor-pointer hover:bg-muted p-2 rounded transition-colors" onClick={handleViewStudents}>
          <div className="text-2xl font-bold text-primary mb-1">
            {school?.metrics?.totalStudents}
          </div>
          <div className="text-xs text-muted-foreground">
            Alunos Especiais
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary mb-1">
            {school?.metrics?.activeTeachers}
          </div>
          <div className="text-xs text-muted-foreground">
            Professores
          </div>
        </div>
        <div className="text-center cursor-pointer hover:bg-muted p-2 rounded transition-colors" onClick={handleViewEvolution}>
          <div className="text-2xl font-bold text-accent mb-1">
            {school?.metrics?.completionRate}%
          </div>
          <div className="text-xs text-muted-foreground">
            Taxa Conclusão
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-1">
            {school?.metrics?.activePrograms}
          </div>
          <div className="text-xs text-muted-foreground">
            Programas Ativos
          </div>
        </div>
      </div>
      
      {/* Coordinator Info */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full">
            <Icon name="User" size={16} color="white" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {school?.coordinator?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Coordenadora
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Users" onClick={handleViewStudents}>
            Ver Alunos
          </Button>
          <Button variant="default" size="sm" iconName="TrendingUp" onClick={handleViewEvolution}>
            Evolução
          </Button>
          <Button variant="ghost" size="sm" iconName="BarChart3" onClick={handleViewSchoolDetails}>
            Detalhes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchoolCard;