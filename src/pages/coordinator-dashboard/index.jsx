import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import SchoolMetrics from './components/SchoolMetrics';
import FilterControls from './components/FilterControls';
import CalendarWidget from './components/CalendarWidget';
import AnnouncementPanel from './components/AnnouncementPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const { schoolId } = useParams();
  const location = useLocation();
  const [filters, setFilters] = useState({
    search: '',
    gradeLevel: 'all',
    classroom: 'all',
    status: 'all',
    sortBy: 'name'
  });

  const [announcements, setAnnouncements] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  // School context - If accessed from secretary dashboard
  const [currentSchool, setCurrentSchool] = useState(null);
  const [accessedFromSecretary, setAccessedFromSecretary] = useState(false);

  // Updated mock data for classrooms with proper age ranges (6-10 years, 1st-5th grade)
  const mockClassrooms = [
  {
    id: 1,
    name: "Sala A - 1º ao 3º Ano",
    teacher: "Ana Paula Santos",
    teacherAvatar: "https://images.unsplash.com/photo-1628013663808-25ef6a3b28b4",
    teacherAvatarAlt: "Professional headshot of Hispanic woman with shoulder-length brown hair in white blouse",
    gradeLevel: "1º-3º Ano",
    totalStudents: 12,
    studentsWithNeeds: 8,
    activeTeachingPlans: 8,
    completionRate: 85,
    status: "active",
    // Annual progress comparison - NEW ADDITION
    annualComparison: {
      proposedProgress: 75,  // Expected progress from school calendar
      currentProgress: 85,   // Actual progress achieved
      comparison: 10,        // +10% ahead
      isAhead: true
    },
    // Teacher engagement metrics
    teacherEngagement: {
      activitiesCreated: 24,
      responseTime: 2.5, // hours
      parentCommunication: 92,
      planUpdates: 18,
      engagementScore: 88
    },
    // Class evolution metrics
    classEvolution: {
      startingAverage: 65,
      currentAverage: 78,
      improvement: 13,
      monthlyGrowth: [65, 68, 72, 75, 78],
      skillAreas: {
        communication: { start: 60, current: 82, improvement: 22 },
        social: { start: 70, current: 85, improvement: 15 },
        motor: { start: 65, current: 75, improvement: 10 },
        cognitive: { start: 68, current: 79, improvement: 11 }
      }
    },
    students: [
    {
      id: 'STU001',
      name: 'João Pedro Silva',
      age: 8,
      grade: '2º Ano',
      specialNeeds: ['Autismo Leve', 'Hipersensibilidade Auditiva'],
      progress: 78,
      photo: "https://images.unsplash.com/photo-1689082511794-8145fb959503",
      photoAlt: 'Foto de perfil de João Pedro, menino de 8 anos com cabelo castanho e sorriso alegre'
    },
    {
      id: 'STU002',
      name: 'Maria Fernanda Costa',
      age: 7,
      grade: '1º Ano',
      specialNeeds: ['Deficiência Visual Parcial'],
      progress: 82,
      photo: "https://images.unsplash.com/photo-1649029767409-034e3ba696da",
      photoAlt: 'Foto de perfil de Maria Fernanda, menina de 7 anos com cabelo loiro e óculos'
    },
    {
      id: 'STU003',
      name: 'Carlos Eduardo Santos',
      age: 9,
      grade: '3º Ano',
      specialNeeds: ['Deficiência Intelectual Leve'],
      progress: 65,
      photo: "https://images.unsplash.com/photo-1727798450911-4f99a48cd03b",
      photoAlt: 'Foto de perfil de Carlos Eduardo, menino de 9 anos com cabelo escuro e sorriso tímido'
    },
    {
      id: 'STU007',
      name: 'Isabela Ferreira',
      age: 6,
      grade: '1º Ano',
      specialNeeds: ['TDAH', 'Dificuldade de Concentração'],
      progress: 73,
      photo: "https://images.unsplash.com/photo-1533071663966-d8ed964f9ae3",
      photoAlt: 'Foto de perfil de Isabela, menina de 6 anos com cabelo cacheado e sorriso doce'
    }]

  },
  {
    id: 2,
    name: "Sala B - 4º ao 5º Ano",
    teacher: "Carlos Eduardo Lima",
    teacherAvatar: "https://images.unsplash.com/photo-1538155421123-6a79813f5deb",
    teacherAvatarAlt: "Professional headshot of middle-aged man with short dark hair in navy suit and tie",
    gradeLevel: "4º-5º Ano",
    totalStudents: 10,
    studentsWithNeeds: 7,
    activeTeachingPlans: 7,
    completionRate: 78,
    status: "active",
    // Annual progress comparison - NEW ADDITION
    annualComparison: {
      proposedProgress: 70,  // Expected progress from school calendar
      currentProgress: 78,   // Actual progress achieved
      comparison: 8,         // +8% ahead
      isAhead: true
    },
    // Teacher engagement metrics
    teacherEngagement: {
      activitiesCreated: 31,
      responseTime: 1.8, // hours
      parentCommunication: 95,
      planUpdates: 22,
      engagementScore: 93
    },
    // Class evolution metrics
    classEvolution: {
      startingAverage: 58,
      currentAverage: 73,
      improvement: 15,
      monthlyGrowth: [58, 62, 66, 70, 73],
      skillAreas: {
        communication: { start: 55, current: 78, improvement: 23 },
        social: { start: 62, current: 80, improvement: 18 },
        motor: { start: 60, current: 72, improvement: 12 },
        cognitive: { start: 55, current: 72, improvement: 17 }
      }
    },
    students: [
    {
      id: 'STU004',
      name: 'Ana Beatriz Lima',
      age: 10,
      grade: '5º Ano',
      specialNeeds: ['Deficiência Auditiva Moderada'],
      progress: 73,
      photo: "https://images.unsplash.com/photo-1560611230-20b57c1b55d5",
      photoAlt: 'Foto de perfil de Ana Beatriz, menina de 10 anos com cabelo cacheado e aparelho auditivo'
    },
    {
      id: 'STU005',
      name: 'Pedro Henrique Oliveira',
      age: 10,
      grade: '4º Ano',
      specialNeeds: ['TDAH', 'Dislexia'],
      progress: 69,
      photo: "https://images.unsplash.com/photo-1698787069911-fe3047094e7b",
      photoAlt: 'Foto de perfil de Pedro Henrique, menino de 10 anos com cabelo escuro e expressão concentrada'
    },
    {
      id: 'STU008',
      name: 'Lucas Gabriel Santos',
      age: 9,
      grade: '4º Ano',
      specialNeeds: ['Deficiência Intelectual Leve', 'Atraso na Fala'],
      progress: 76,
      photo: "https://images.unsplash.com/photo-1727798450911-4f99a48cd03b",
      photoAlt: 'Foto de perfil de Lucas Gabriel, menino de 9 anos com cabelo escuro e sorriso tímido'
    }]

  },
  {
    id: 3,
    name: "Sala C - 1º ao 2º Ano",
    teacher: "Fernanda Oliveira",
    teacherAvatar: "https://images.unsplash.com/photo-1671545609946-35c7407440ab",
    teacherAvatarAlt: "Professional headshot of young woman with long blonde hair in light blue shirt",
    gradeLevel: "1º-2º Ano",
    totalStudents: 8,
    studentsWithNeeds: 6,
    activeTeachingPlans: 6,
    completionRate: 92,
    status: "active",
    // Annual progress comparison - NEW ADDITION
    annualComparison: {
      proposedProgress: 80,  // Expected progress from school calendar
      currentProgress: 92,   // Actual progress achieved  
      comparison: 12,        // +12% ahead
      isAhead: true
    },
    // Teacher engagement metrics
    teacherEngagement: {
      activitiesCreated: 28,
      responseTime: 2.1, // hours
      parentCommunication: 89,
      planUpdates: 20,
      engagementScore: 85
    },
    // Class evolution metrics
    classEvolution: {
      startingAverage: 72,
      currentAverage: 88,
      improvement: 16,
      monthlyGrowth: [72, 76, 80, 84, 88],
      skillAreas: {
        communication: { start: 70, current: 92, improvement: 22 },
        social: { start: 75, current: 90, improvement: 15 },
        motor: { start: 68, current: 85, improvement: 17 },
        cognitive: { start: 75, current: 86, improvement: 11 }
      }
    },
    students: [
    {
      id: 'STU006',
      name: 'Sofia Almeida',
      age: 6,
      grade: '1º Ano',
      specialNeeds: ['Deficiência Física Leve', 'Atraso no Desenvolvimento Motor'],
      progress: 88,
      photo: "https://images.unsplash.com/photo-1533071663966-d8ed964f9ae3",
      photoAlt: 'Foto de perfil de Sofia, menina de 6 anos com cabelo liso e sorriso doce'
    },
    {
      id: 'STU009',
      name: 'Miguel Costa',
      age: 7,
      grade: '2º Ano',
      specialNeeds: ['Síndrome de Down'],
      progress: 82,
      photo: "https://images.unsplash.com/photo-1727449843811-065c2723cc32",
      photoAlt: 'Foto de perfil de Miguel, menino de 7 anos com cabelo castanho e sorriso alegre'
    }]

  }];


  // Updated school metrics
  const schoolMetrics = {
    totalStudents: 30,
    studentsWithSpecialNeeds: 21,
    activeClassrooms: 3,
    activePlans: 21,
    averageProgress: 81,
    completedActivities: 189,
    parentEngagement: 85,
    activeTeachers: 3,
    teacherEngagementAverage: 89
  };

  // Mock calendar events
  const calendarEvents = [
  {
    id: 1,
    title: "Reunião de Pais - Sala A",
    date: "2025-11-05",
    formattedDate: "05/11/2025",
    type: "meeting"
  },
  {
    id: 2,
    title: "Avaliação Trimestral",
    date: "2025-11-08",
    formattedDate: "08/11/2025",
    type: "assessment"
  },
  {
    id: 3,
    title: "Planejamento Pedagógico",
    date: "2025-11-12",
    formattedDate: "12/11/2025",
    type: "planning"
  }];


  // Mock initial announcements
  const initialAnnouncements = [
  {
    id: 1,
    title: "Reunião Pedagógica - Novembro",
    content: "Reunião pedagógica agendada para o dia 15 de novembro às 14h. Pauta: planejamento do 4º bimestre e avaliações adaptadas.",
    priority: "medium",
    author: "Coordenadora Maria Silva",
    date: "03/11/2025",
    time: "09:30"
  },
  {
    id: 2,
    title: "Nova Ferramenta de Comunicação",
    content: "Implementamos um novo sistema de comunicação com os pais. Todos os professores devem participar do treinamento na próxima semana.",
    priority: "high",
    author: "Coordenadora Maria Silva",
    date: "02/11/2025",
    time: "16:45"
  }];


  useEffect(() => {
    // Check if accessed from secretary dashboard
    if (schoolId) {
      setAccessedFromSecretary(true);
      // Here you would typically fetch school-specific data
      // For now, we'll use mock data but with school context
      const mockSchoolData = {
        id: schoolId,
        name: getSchoolNameById(schoolId),
        // Add other school-specific properties
      };
      setCurrentSchool(mockSchoolData);
    }
    
    // Check authentication
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser?.role || (currentUser?.role !== 'coordinator' && currentUser?.role !== 'secretary')) {
      navigate('/login');
      return;
    }

    setAnnouncements(initialAnnouncements);
  }, [navigate, schoolId]);

  // Helper function to get school name by ID (mock implementation)
  const getSchoolNameById = (id) => {
    const schoolNames = {
      '1': 'EMEF Prof. Maria Silva',
      '2': 'EMEI Pequenos Sonhos',
      '3': 'CEMEI Arco-Íris',
      '4': 'EMEF João Batista',
      '5': 'EMEI Futuro Brilhante',
      '6': 'EMEF Esperança Nova'
    };
    return schoolNames?.[id] || 'Escola Selecionada';
  };

  const handleBackToSecretary = () => {
    navigate('/secretary-dashboard');
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      gradeLevel: 'all',
      classroom: 'all',
      status: 'all',
      sortBy: 'name'
    });
  };

  const handleCreateAnnouncement = (newAnnouncement) => {
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  };

  const handleClassroomClick = (classroom) => {
    setSelectedClassroom(classroom);
    setSelectedStudent(null);
  };

  const handleStudentClick = (student) => {
    // Navigate to individual student profile with dynamic route
    navigate(`/student-profile/${student?.id}`);
  };

  const handleBackToClassrooms = () => {
    setSelectedClassroom(null);
    setSelectedStudent(null);
  };

  const handleToggleCollapse = () => {
    setIsNavCollapsed((prev) => !prev);
  };

  // Filter and sort classrooms
  const filteredClassrooms = mockClassrooms?.filter((classroom) => {
    const matchesSearch = classroom?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
    classroom?.teacher?.toLowerCase()?.includes(filters?.search?.toLowerCase());
    const matchesGrade = filters?.gradeLevel === 'all' || classroom?.gradeLevel?.includes(filters?.gradeLevel);
    const matchesStatus = filters?.status === 'all' || classroom?.status === filters?.status;

    return matchesSearch && matchesGrade && matchesStatus;
  })?.sort((a, b) => {
    switch (filters?.sortBy) {
      case 'students':
        return b?.totalStudents - a?.totalStudents;
      case 'completion':
        return b?.completionRate - a?.completionRate;
      default:
        return a?.name?.localeCompare(b?.name);
    }
  });

  // Filter students in selected classroom
  const filteredStudents = selectedClassroom?.students?.filter((student) => {
    const matchesSearch = student?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
    student?.specialNeeds?.some((need) => need?.toLowerCase()?.includes(filters?.search?.toLowerCase()));
    return matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Dashboard do Coordenador - Edu+ Inclusiva</title>
        <meta name="description" content="Dashboard para coordenadores gerenciarem salas de aula e acompanharem o progresso dos alunos com necessidades especiais" />
      </Helmet>
      {/* Main Navigation */}
      <MainNavigation onToggleCollapse={handleToggleCollapse} />
      <div className="min-h-screen bg-background">
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BreadcrumbNavigation />
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Back to Secretary Button - Only show if accessed from secretary */}
                  {accessedFromSecretary && (
                    <div className="flex items-center space-x-4 mb-4">
                      <Button
                        variant="outline"
                        onClick={handleBackToSecretary}
                        iconName="ArrowLeft"
                        iconPosition="left"
                        className="shrink-0"
                      >
                        Voltar ao Dashboard da Secretária
                      </Button>
                    </div>
                  )}
                  
                  {selectedClassroom ? (
                    <div className="flex items-center space-x-4 mb-4">
                      <Button
                        variant="outline"
                        onClick={handleBackToClassrooms}
                        iconName="ArrowLeft"
                        iconPosition="left"
                        className="shrink-0"
                      >
                        Voltar às Salas
                      </Button>
                    </div>
                  ) : null}
                  
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {selectedClassroom 
                      ? selectedClassroom?.name 
                      : accessedFromSecretary && currentSchool 
                        ? `${currentSchool?.name} - Dashboard do Coordenador`
                        : 'Dashboard do Coordenador'
                    }
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {selectedClassroom
                      ? `Gerencie os alunos da ${selectedClassroom?.name} com a professora ${selectedClassroom?.teacher}`
                      : accessedFromSecretary && currentSchool
                        ? `Visão detalhada da escola ${currentSchool?.name} - Acesso de Secretária`
                        : 'Gerencie as salas de aula e acompanhe o progresso da escola'
                    }
                  </p>
                  {accessedFromSecretary && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        <Icon name="Shield" size={12} className="mr-1" />
                        Acesso de Secretária - Todos os Níveis
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 shrink-0">
                  <Button variant="outline" iconName="Download" className="w-full sm:w-auto">
                    Exportar Relatórios
                  </Button>
                  {!selectedClassroom && (
                    <Button iconName="Plus" className="w-full sm:w-auto">
                      Nova Sala
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {!selectedClassroom && (
              <>
                {/* School Metrics */}
                <div className="mb-8">
                  <SchoolMetrics metrics={schoolMetrics} />
                </div>

                {/* Teacher Engagement Metrics */}
                <div className="mb-8">
                  <div className="bg-card border border-border rounded-lg p-6 shadow-educational">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-foreground">Engajamento dos Professores</h2>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="Users" size={16} />
                        <span>89% engajamento médio</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {mockClassrooms?.map((classroom) =>
                    <div key={classroom?.id} className="bg-muted/30 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <img
                          src={classroom?.teacherAvatar}
                          alt={classroom?.teacherAvatarAlt}
                          className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />

                            <div>
                              <p className="text-sm font-medium text-foreground">{classroom?.teacher}</p>
                              <p className="text-xs text-muted-foreground">{classroom?.name}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Atividades criadas:</span>
                              <span className="font-medium text-foreground">{classroom?.teacherEngagement?.activitiesCreated}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Tempo de resposta:</span>
                              <span className="font-medium text-success">{classroom?.teacherEngagement?.responseTime}h</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Comunicação com pais:</span>
                              <span className="font-medium text-success">{classroom?.teacherEngagement?.parentCommunication}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Planos atualizados:</span>
                              <span className="font-medium text-foreground">{classroom?.teacherEngagement?.planUpdates}</span>
                            </div>
                          </div>

                          {/* Teacher Engagement Score */}
                          <div className="mt-4 pt-3 border-t border-border">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-muted-foreground">Score de Engajamento</span>
                              <span className="text-xs font-medium text-foreground">{classroom?.teacherEngagement?.engagementScore}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${classroom?.teacherEngagement?.engagementScore}%` }} />

                            </div>
                          </div>
                        </div>
                    )}
                    </div>

                    {/* Overall Teacher Engagement */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Engajamento Geral dos Professores</span>
                        <span className="text-sm font-medium text-foreground">89%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-success h-2 rounded-full transition-all duration-300" style={{ width: '89%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Baseado na criação de atividades, tempo de resposta, comunicação e atualizações dos planos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Class Evolution Metrics */}
                <div className="mb-8">
                  <div className="bg-card border border-border rounded-lg p-6 shadow-educational">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-foreground">Evolução Detalhada das Salas</h2>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="TrendingUp" size={16} />
                        <span>Progresso por sala de aula</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {mockClassrooms?.map((classroom) =>
                    <div key={classroom?.id} className="bg-muted/30 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{classroom?.name}</h3>
                              <p className="text-sm text-muted-foreground">Professor: {classroom?.teacher}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-success">+{classroom?.classEvolution?.improvement}%</div>
                              <div className="text-xs text-muted-foreground">Melhoria geral</div>
                            </div>
                          </div>

                          {/* Progress Overview */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-muted-foreground">{classroom?.classEvolution?.startingAverage}%</div>
                              <div className="text-xs text-muted-foreground">Média Inicial</div>
                            </div>
                            <div className="text-center">
                              <Icon name="ArrowRight" size={20} className="mx-auto text-muted-foreground" />
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-primary">{classroom?.classEvolution?.currentAverage}%</div>
                              <div className="text-xs text-muted-foreground">Média Atual</div>
                            </div>
                          </div>

                          {/* Skill Areas Progress */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {Object.entries(classroom?.classEvolution?.skillAreas || {})?.map(([skill, data]) =>
                        <div key={skill} className="bg-background/50 rounded-lg p-3">
                                <div className="text-sm font-medium text-foreground mb-2 capitalize">
                                  {skill === 'communication' ? 'Comunicação' :
                            skill === 'social' ? 'Social' :
                            skill === 'motor' ? 'Motor' : 'Cognitivo'}
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>{data?.start}%</span>
                                  <span className="text-success">+{data?.improvement}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2 mb-1">
                                  <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${data?.current}%` }} />

                                </div>
                                <div className="text-xs font-medium text-foreground">{data?.current}%</div>
                              </div>
                        )}
                          </div>

                          {/* Monthly Growth Trend */}
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-3">Crescimento Mensal</h4>
                            <div className="flex items-end space-x-2 h-20">
                              {classroom?.classEvolution?.monthlyGrowth?.map((value, index) =>
                          <div key={index} className="flex-1 flex flex-col items-center">
                                  <div
                              className="w-full bg-primary rounded-t-sm transition-all duration-300"
                              style={{ height: `${value / 100 * 100}%` }} />

                                  <div className="text-xs text-muted-foreground mt-1">Mês {index + 1}</div>
                                  <div className="text-xs font-medium text-foreground">{value}%</div>
                                </div>
                          )}
                            </div>
                          </div>
                        </div>
                    )}
                    </div>
                  </div>
                </div>

                {/* Annual Progress Comparison Section - NEW ADDITION */}
                <div className="mb-8">
                  <div className="bg-card border border-border rounded-lg p-6 shadow-educational">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-foreground">Comparativo de Progresso Anual</h2>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="BarChart3" size={16} />
                        <span>Planejado vs Realizado</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {mockClassrooms?.map((classroom) => {
                        const comparison = classroom?.annualComparison;
                        return (
                          <div key={classroom?.id} className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="text-sm font-semibold text-foreground">{classroom?.name}</h3>
                                <p className="text-xs text-muted-foreground">Prof. {classroom?.teacher}</p>
                              </div>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                comparison?.isAhead ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                              }`}>
                                {comparison?.isAhead ? '+' : ''}{comparison?.comparison}%
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="text-center">
                                <div className="text-lg font-bold text-muted-foreground">{comparison?.proposedProgress}%</div>
                                <div className="text-xs text-muted-foreground">Calendário</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-success">{comparison?.currentProgress}%</div>
                                <div className="text-xs text-muted-foreground">Realizado</div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {/* Proposed Progress */}
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Proposto</span>
                                  <span>{comparison?.proposedProgress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="h-2 bg-muted-foreground rounded-full"
                                    style={{ width: `${comparison?.proposedProgress}%` }}
                                  />
                                </div>
                              </div>
                              
                              {/* Actual Progress */}
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-foreground">Atual</span>
                                  <span className="text-foreground font-medium">{comparison?.currentProgress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      comparison?.isAhead ? 'bg-success' : 'bg-warning'
                                    }`}
                                    style={{ width: `${comparison?.currentProgress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mt-3">
                              {comparison?.isAhead 
                                ? `${Math.abs(comparison?.comparison)}% à frente do planejado`
                                : `${Math.abs(comparison?.comparison)}% atrás do planejado`
                              }
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall School Progress Comparison */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="bg-muted/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-foreground">Progresso Geral da Escola</h3>
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                            +10% à frente
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-xl font-bold text-muted-foreground">75%</div>
                            <div className="text-xs text-muted-foreground">Proposto no Calendário Escolar</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-success">85%</div>
                            <div className="text-xs text-muted-foreground">Progresso Atual Consolidado</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Meta do calendário escolar</span>
                              <span>75%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="h-3 bg-muted-foreground rounded-full" style={{ width: '75%' }} />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-foreground">Progresso consolidado</span>
                              <span className="text-foreground font-medium">85%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div className="h-3 bg-success rounded-full" style={{ width: '85%' }} />
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                          A escola está 10% à frente do cronograma proposto no calendário escolar municipal, 
                          demonstrando excelente andamento das atividades pedagógicas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parent Engagement Section */}
                <div className="mb-8">
                  <div className="bg-card border border-border rounded-lg p-6 shadow-educational">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-foreground">Engajamento dos Pais</h2>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="Heart" size={16} />
                        <span>85% de participação</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Communication Stats */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 text-primary rounded-lg">
                            <Icon name="MessageCircle" size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Comunicação Ativa</p>
                            <p className="text-xs text-muted-foreground">Mensagens e reuniões</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Mensagens enviadas:</span>
                            <span className="font-medium text-foreground">124</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Taxa de resposta:</span>
                            <span className="font-medium text-success">78%</span>
                          </div>
                        </div>
                      </div>

                      {/* Meeting Participation */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 text-secondary rounded-lg">
                            <Icon name="Users" size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Reuniões</p>
                            <p className="text-xs text-muted-foreground">Participação em reuniões</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Reuniões este mês:</span>
                            <span className="font-medium text-foreground">8</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Presença média:</span>
                            <span className="font-medium text-success">82%</span>
                          </div>
                        </div>
                      </div>

                      {/* Home Activities Support */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 text-accent rounded-lg">
                            <Icon name="Home" size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Apoio Domiciliar</p>
                            <p className="text-xs text-muted-foreground">Atividades em casa</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Atividades realizadas:</span>
                            <span className="font-medium text-foreground">156</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Taxa de conclusão:</span>
                            <span className="font-medium text-success">91%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Engajamento Geral dos Pais</span>
                        <span className="text-sm font-medium text-foreground">85%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-success h-2 rounded-full transition-all duration-300" style={{ width: '85%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Baseado na participação em comunicação, reuniões e apoio às atividades domiciliares
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Classrooms/Students Section */}
              <div className="xl:col-span-2">
                {!selectedClassroom ?
                // Classrooms View
                <>
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                          Salas de Aula ({filteredClassrooms?.length})
                        </h2>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                          <Icon name="Building" size={16} />
                          <span>Total: {mockClassrooms?.length} salas ativas</span>
                        </div>
                      </div>
                      
                      <FilterControls
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onClearFilters={handleClearFilters}
                      showClassroomFilter={true} />

                    </div>
                    {/* Classrooms Grid */}
                    {filteredClassrooms?.length === 0 ?
                  <div className="bg-card border border-border rounded-lg p-8 sm:p-12 text-center shadow-educational">
                        <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                          Nenhuma sala encontrada
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                          Tente ajustar os filtros para encontrar salas de aula
                        </p>
                        <Button variant="outline" onClick={handleClearFilters}>
                          Limpar Filtros
                        </Button>
                      </div> :

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {filteredClassrooms?.map((classroom) =>
                    <div
                      key={classroom?.id}
                      onClick={() => handleClassroomClick(classroom)}
                      className="bg-card border border-border rounded-lg p-6 shadow-educational hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/20">

                            {/* Classroom Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                  {classroom?.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {classroom?.gradeLevel}
                                </p>
                              </div>
                              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        classroom?.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`
                        }>
                                {classroom?.status === 'active' ? 'Ativo' : 'Pendente'}
                              </div>
                            </div>

                            {/* Teacher Info */}
                            <div className="flex items-center space-x-3 mb-4 p-3 bg-muted/30 rounded-lg">
                              <img
                          src={classroom?.teacherAvatar}
                          alt={classroom?.teacherAvatarAlt}
                          className="w-10 h-10 rounded-full object-cover" />

                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {classroom?.teacher}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Professor Responsável
                                </p>
                              </div>
                            </div>

                            {/* Classroom Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Total de Alunos</p>
                                <p className="text-lg font-semibold text-foreground">
                                  {classroom?.totalStudents}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Com Necessidades</p>
                                <p className="text-lg font-semibold text-primary">
                                  {classroom?.studentsWithNeeds}
                                </p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-muted-foreground">Taxa de Conclusão</span>
                                <span className="text-xs font-medium text-foreground">
                                  {classroom?.completionRate}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${classroom?.completionRate}%` }} />

                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <span className="text-xs text-muted-foreground">
                                {classroom?.activeTeachingPlans} planos ativos
                              </span>
                              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                            </div>
                          </div>
                    )}
                      </div>
                  }
                  </> :

                // Students View
                <>
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                          Alunos ({filteredStudents?.length})
                        </h2>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                          <Icon name="Users" size={16} />
                          <span>Total: {selectedClassroom?.students?.length} alunos</span>
                        </div>
                      </div>
                    </div>
                    {/* Students Grid */}
                    {filteredStudents?.length === 0 ?
                  <div className="bg-card border border-border rounded-lg p-8 sm:p-12 text-center shadow-educational">
                        <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                          Nenhum aluno encontrado
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                          Esta sala não possui alunos cadastrados
                        </p>
                      </div> :

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {filteredStudents?.map((student) =>
                    <div
                      key={student?.id}
                      onClick={() => handleStudentClick(student)}
                      className="bg-card border border-border rounded-lg p-6 shadow-educational hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/20">

                            {/* Student Header */}
                            <div className="flex items-start space-x-4 mb-4">
                              <img
                          src={student?.photo}
                          alt={student?.photoAlt}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />

                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                                  {student?.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {student?.age} anos • {student?.grade}
                                </p>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  Progresso: {student?.progress}%
                                </div>
                              </div>
                            </div>

                            {/* Special Needs */}
                            <div className="mb-4">
                              <p className="text-xs text-muted-foreground mb-2">Necessidades Especiais:</p>
                              <div className="flex flex-wrap gap-1">
                                {student?.specialNeeds?.map((need, index) =>
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs text-foreground">

                                    {need}
                                  </span>
                          )}
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                            className="bg-success h-2 rounded-full transition-all duration-300"
                            style={{ width: `${student?.progress}%` }} />

                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <span className="text-xs text-muted-foreground">
                                Ver plano individual
                              </span>
                              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                            </div>
                          </div>
                    )}
                      </div>
                  }
                  </>
                }
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Calendar Widget */}
                <CalendarWidget events={calendarEvents} />
                
                {/* Announcements Panel */}
                <AnnouncementPanel
                  announcements={announcements}
                  onCreateAnnouncement={handleCreateAnnouncement} />

              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CoordinatorDashboard;