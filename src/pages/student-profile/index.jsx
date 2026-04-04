import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import StudentHeader from './components/StudentHeader';
import PersonalInfoTab from './components/PersonalInfoTab';
import AcademicInfoTab from './components/AcademicInfoTab';
import ProgressTab from './components/ProgressTab';
import ActivitiesTab from './components/ActivitiesTab';
import CommunicationTab from './components/CommunicationTab';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { getAluno, getAlunoMetricas, getPlanos, getHistoricoPlanos } from '../../api/api';

const StudentProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [student, setStudent] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const activitiesTabRef = useRef(null);
  const navigate = useNavigate();
  const { studentId } = useParams();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user?.role) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    if (!studentId) {
      setLoading(false);
      return;
    }

    async function loadStudent() {
      try {
        const [alunoResult, metricasResult, planosResult, historicoResult] = await Promise.allSettled([
          getAluno(studentId),
          getAlunoMetricas(studentId),
          getPlanos(studentId),
          getHistoricoPlanos(studentId),
        ]);

        const m = metricasResult.status === 'fulfilled' ? metricasResult.value : null;

        if (alunoResult.status === 'fulfilled') {
          const a = alunoResult.value;
          setStudent({
            id: a.id,
            name: a.nome,
            registrationNumber: a.matricula || '',
            photo: a.foto || null,
            photoAlt: `Foto de perfil de ${a.nome}`,
            birthDate: a.data_nascimento || null,
            gender: a.genero || null,
            age: a.idade,
            grade: a.sala || '',
            class: '', // TODO: sem campo separado no backend — sala contém a turma
            school: a.escola || '',
            teacher: a.professor_nome || '',
            schedule: a.horario_aulas || '',
            specialNeeds: a.necessidade ? [a.necessidade] : [],
            accommodations: a.observacoes || '',
            learningObjectives: a.objetivos_aprendizado || '',
            currentLevel: m?.nivel_aprendizado || a.nivel_aprendizado || '',
            overallProgress: m?.progresso_geral ?? a.progresso_geral ?? null,
            lastAssessment: '', // TODO: sem endpoint de avaliações ainda
            address: a.endereco || '',
            phone: a.telefone_contato || '',
            emergencyContact: {
              name: a.contato_emergencia_nome || '',
              phone: a.contato_emergencia_telefone || '',
              relationship: a.contato_emergencia_parentesco || '',
            },
            medicalInfo: a.informacoes_medicas || '',
            allergies: a.alergias || '',
            medications: a.medicamentos || '',
          });
        }

        if (m) {
          setMetricas(m);
        }

        if (planosResult.status === 'fulfilled') {
          setPlanos(Array.isArray(planosResult.value) ? planosResult.value : []);
        }

        if (historicoResult.status === 'fulfilled') {
          setHistorico(Array.isArray(historicoResult.value) ? historicoResult.value : []);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil do aluno:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, [navigate, studentId]);

  const tabs = [
    {
      id: 'personal',
      label: 'Informações Pessoais',
      icon: 'User',
      component: PersonalInfoTab,
    },
    {
      id: 'academic',
      label: 'Dados Acadêmicos',
      icon: 'GraduationCap',
      component: AcademicInfoTab,
    },
    {
      id: 'progress',
      label: 'Progresso',
      icon: 'TrendingUp',
      component: ProgressTab,
    },
    {
      id: 'activities',
      label: 'Atividades',
      icon: 'BookOpen',
      component: ActivitiesTab,
    },
    {
      id: 'communication',
      label: 'Comunicação',
      icon: 'MessageCircle',
      component: CommunicationTab,
    },
  ];

  const handleUpdateStudent = (updatedData) => {
    setStudent((prev) => ({ ...prev, ...updatedData }));
    // TODO: enviar PUT /v1/alunos/{id} quando o backend suportar todos os campos
    console.log('Updating student data:', updatedData);
  };

  const handleUpdateAcademicInfo = (updatedData) => {
    setStudent((prev) => ({ ...prev, ...updatedData }));
    // TODO: enviar PUT /v1/alunos/{id} quando o backend suportar todos os campos
    console.log('Updating academic info:', updatedData);
  };

  const handleGerarAtividade = () => {
    setActiveTab('activities');
    setTimeout(() => {
      activitiesTabRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleUploadPhoto = () => {
    console.log('Upload photo clicked');
  };

  const handleToggleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNavigation onToggleCollapse={handleToggleNavCollapse} />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando perfil do aluno...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background">
        <MainNavigation onToggleCollapse={handleToggleNavCollapse} />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Aluno não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                Não foi possível carregar as informações do aluno.
              </p>
              <Button onClick={() => navigate(-1)} iconName="ArrowLeft" iconPosition="left">
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ActiveTabComponent = tabs?.find((tab) => tab?.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={handleToggleNavCollapse} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />

          <StudentHeader
            student={student}
            currentUser={currentUser}
            onEditProfile={handleEditProfile}
            onUploadPhoto={handleUploadPhoto}
            onGerarAtividade={handleGerarAtividade}
          />

          <div className="mt-8">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-educational ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div ref={activitiesTabRef} className="mt-8">
              {ActiveTabComponent && (
                <ActiveTabComponent
                  student={student}
                  currentUser={currentUser}
                  onUpdateStudent={handleUpdateStudent}
                  onUpdateAcademicInfo={handleUpdateAcademicInfo}
                  planos={planos}
                  historico={historico}
                  metricas={metricas}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
