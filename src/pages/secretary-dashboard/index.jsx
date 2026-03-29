import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import NetworkOverview from './components/NetworkOverview';
import SchoolCard from './components/SchoolCard';
import AnalyticsChart from './components/AnalyticsChart';
import FilterControls from './components/FilterControls';
import AlertsPanel from './components/AlertsPanel';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SecretaryDashboard = () => {
  const navigate = useNavigate();
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    district: 'all',
    schoolType: 'all',
    program: 'all',
    status: 'all'
  });

  // Mock data for network statistics
  const networkStats = {
    totalSchools: 45,
    totalSpecialStudents: 1247,
    totalTeachers: 189,
    averageSuccessRate: 87.5
  };

  // Mock data for schools
  const [schools] = useState([
    {
      id: 1,
      name: "EMEF Prof. Maria Silva",
      address: "Rua das Flores, 123 - Centro",
      status: "excellent",
      statusLabel: "Excelente",
      hasAlerts: false,
      metrics: {
        totalStudents: 45,
        activeTeachers: 8,
        completionRate: 92,
        activePrograms: 4
      },
      coordinator: {
        name: "Ana Paula Santos",
        email: "ana.santos@edu.sp.gov.br"
      },
      district: "centro",
      schoolType: "emef",
      programs: ["autism", "intellectual"]
    },
    {
      id: 2,
      name: "EMEI Pequenos Sonhos",
      address: "Av. Brasil, 456 - Zona Norte",
      status: "good",
      statusLabel: "Bom",
      hasAlerts: false,
      metrics: {
        totalStudents: 32,
        activeTeachers: 6,
        completionRate: 85,
        activePrograms: 3
      },
      coordinator: {
        name: "Carlos Eduardo Lima",
        email: "carlos.lima@edu.sp.gov.br"
      },
      district: "norte",
      schoolType: "emei",
      programs: ["autism", "physical"]
    },
    {
      id: 3,
      name: "CEMEI Arco-Íris",
      address: "Rua da Esperança, 789 - Zona Sul",
      status: "attention",
      statusLabel: "Atenção",
      hasAlerts: true,
      metrics: {
        totalStudents: 28,
        activeTeachers: 5,
        completionRate: 78,
        activePrograms: 2
      },
      coordinator: {
        name: "Mariana Costa",
        email: "mariana.costa@edu.sp.gov.br"
      },
      district: "sul",
      schoolType: "cemei",
      programs: ["visual", "hearing"]
    },
    {
      id: 4,
      name: "EMEF João Batista",
      address: "Rua dos Pinheiros, 321 - Zona Leste",
      status: "good",
      statusLabel: "Bom",
      hasAlerts: false,
      metrics: {
        totalStudents: 38,
        activeTeachers: 7,
        completionRate: 88,
        activePrograms: 3
      },
      coordinator: {
        name: "Roberto Silva",
        email: "roberto.silva@edu.sp.gov.br"
      },
      district: "leste",
      schoolType: "emef",
      programs: ["intellectual", "physical"]
    },
    {
      id: 5,
      name: "EMEI Futuro Brilhante",
      address: "Av. das Nações, 654 - Zona Oeste",
      status: "critical",
      statusLabel: "Crítico",
      hasAlerts: true,
      metrics: {
        totalStudents: 22,
        activeTeachers: 4,
        completionRate: 65,
        activePrograms: 2
      },
      coordinator: {
        name: "Fernanda Oliveira",
        email: "fernanda.oliveira@edu.sp.gov.br"
      },
      district: "oeste",
      schoolType: "emei",
      programs: ["autism"]
    },
    {
      id: 6,
      name: "EMEF Esperança Nova",
      address: "Rua da Liberdade, 987 - Centro",
      status: "excellent",
      statusLabel: "Excelente",
      hasAlerts: false,
      metrics: {
        totalStudents: 41,
        activeTeachers: 9,
        completionRate: 94,
        activePrograms: 5
      },
      coordinator: {
        name: "Paulo Henrique",
        email: "paulo.henrique@edu.sp.gov.br"
      },
      district: "centro",
      schoolType: "emef",
      programs: ["autism", "intellectual", "visual"]
    }
  ]);

  // Mock data for alerts - Updated to focus on school evolution and student progress
  const [alerts] = useState([
    {
      id: 1,
      type: "critical",
      title: "Baixa Taxa de Conclusão",
      message: "EMEI Futuro Brilhante apresenta taxa de conclusão abaixo de 70%",
      school: "EMEI Futuro Brilhante",
      timestamp: new Date(Date.now() - 1800000), // 30 min ago
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      type: "info",
      title: "Evolução Positiva",
      message: "CEMEI Arco-Íris mostra melhoria de 15% na evolução dos alunos este mês",
      school: "CEMEI Arco-Íris",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
      actionRequired: false
    },
    {
      id: 3,
      type: "warning",
      title: "Alunos Precisam de Atenção",
      message: "3 alunos na EMEF João Batista necessitam de acompanhamento especial",
      school: "EMEF João Batista",
      timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
      read: false,
      actionRequired: true
    },
    {
      id: 4,
      type: "success",
      title: "Meta Atingida",
      message: "EMEF Esperança Nova atingiu 94% de taxa de conclusão - Excelente evolução!",
      school: "EMEF Esperança Nova",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
      actionRequired: false
    },
    {
      id: 5,
      type: "info",
      title: "Relatório Mensal Disponível",
      message: "Relatório de evolução dos alunos de outubro já está disponível para análise",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      read: true,
      actionRequired: false
    }
  ]);

  // Mock data for charts
  const progressData = [
    { name: 'Jan', value: 82 },
    { name: 'Fev', value: 85 },
    { name: 'Mar', value: 88 },
    { name: 'Abr', value: 87 },
    { name: 'Mai', value: 90 },
    { name: 'Jun', value: 89 },
    { name: 'Jul', value: 92 },
    { name: 'Ago', value: 91 },
    { name: 'Set', value: 94 },
    { name: 'Out', value: 88 }
  ];

  const resourceData = [
    { name: 'Centro', value: 15 },
    { name: 'Norte', value: 12 },
    { name: 'Sul', value: 8 },
    { name: 'Leste', value: 6 },
    { name: 'Oeste', value: 4 }
  ];

  useEffect(() => {
    // Check authentication
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser?.role || currentUser?.role !== 'secretary') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      district: 'all',
      schoolType: 'all',
      program: 'all',
      status: 'all'
    });
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick action clicked:', actionId);
    // Handle different quick actions
    switch (actionId) {
      case 'generate-report':
        // Navigate to report generation
        break;
      case 'manage-coordinators':
        // Navigate to coordinator management
        break;
      case 'system-announcements':
        // Navigate to announcements
        break;
      default:
        break;
    }
  };

  const handleToggleCollapse = () => {
    setIsNavigationCollapsed(!isNavigationCollapsed);
  };

  // Filter schools based on current filters
  const filteredSchools = schools?.filter(school => {
    if (filters?.district !== 'all' && school?.district !== filters?.district) return false;
    if (filters?.schoolType !== 'all' && school?.schoolType !== filters?.schoolType) return false;
    if (filters?.status !== 'all' && school?.status !== filters?.status) return false;
    if (filters?.program !== 'all' && !school?.programs?.includes(filters?.program)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={handleToggleCollapse} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <BreadcrumbNavigation />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Dashboard da Secretária
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Visão geral da rede municipal de educação especial
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 shrink-0">
                <Button variant="outline" iconName="Download" className="w-full sm:w-auto">
                  Exportar Dados
                </Button>
                <Button variant="default" iconName="Plus" className="w-full sm:w-auto">
                  Nova Escola
                </Button>
              </div>
            </div>
          </div>

          {/* Network Overview Stats */}
          <NetworkOverview networkStats={networkStats} />

          {/* Filter Controls */}
          <FilterControls 
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Schools Grid - Takes 2 columns on large screens */}
            <div className="xl:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Escolas da Rede ({filteredSchools?.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" iconName="Grid3X3" className="text-xs sm:text-sm">
                    Grade
                  </Button>
                  <Button variant="ghost" size="sm" iconName="List" className="text-xs sm:text-sm">
                    Lista
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 sm:gap-6 mb-8">
                {filteredSchools?.map((school) => (
                  <SchoolCard key={school?.id} school={school} />
                ))}
              </div>

              {filteredSchools?.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                    Nenhuma escola encontrada
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Tente ajustar os filtros para ver mais resultados
                  </p>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <AlertsPanel alerts={alerts} />
              <QuickActions onActionClick={handleQuickAction} />
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-8">
            <AnalyticsChart 
              chartData={progressData}
              chartType="line"
              title="Evolução da Taxa de Sucesso (%)"
            />
            <AnalyticsChart 
              chartData={resourceData}
              chartType="bar"
              title="Distribuição de Escolas por Distrito"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecretaryDashboard;