import React from 'react';
import Icon from '../../../components/AppIcon';

const NetworkOverview = ({ networkStats }) => {
  const statCards = [
    {
      title: 'Total de Escolas',
      value: networkStats?.totalSchools,
      icon: 'School',
      color: 'bg-blue-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Alunos Especiais',
      value: networkStats?.totalSpecialStudents,
      icon: 'Users',
      color: 'bg-green-500',
      change: '+15',
      changeType: 'positive'
    },
    {
      title: 'Professores Ativos',
      value: networkStats?.totalTeachers,
      icon: 'GraduationCap',
      color: 'bg-purple-500',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Taxa de Sucesso',
      value: `${networkStats?.averageSuccessRate}%`,
      icon: 'TrendingUp',
      color: 'bg-emerald-500',
      change: '+2.5%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-educational hover-scale transition-educational">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center justify-center w-12 h-12 ${stat?.color} rounded-lg`}>
              <Icon name={stat?.icon} size={24} color="white" />
            </div>
            <div className={`flex items-center space-x-1 text-xs font-medium ${
              stat?.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <Icon 
                name={stat?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                size={12} 
              />
              <span>{stat?.change}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {stat?.value}
            </h3>
            <p className="text-sm text-muted-foreground">
              {stat?.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NetworkOverview;