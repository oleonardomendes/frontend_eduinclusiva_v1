import React, { useState, useEffect } from 'react';
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
import { getAluno, getPlanos, getHistoricoPlanos } from '../../api/api';

const StudentProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [student, setStudent] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
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
        const [alunoResult, planosResult, historicoResult] = await Promise.allSettled([
          getAluno(studentId),
          getPlanos(studentId),
          getHistoricoPlanos(studentId),
        ]);

        if (alunoResult.status === 'fulfilled') {
          const a = alunoResult.value;
          setStudent({
            id: a.id,
            name: a.nome,
            registrationNumber: a.matricula || '', // TODO: backend field
            photo: a.foto || null, // TODO: backend field
            photoAlt: `Foto de perfil de ${a.nome}`,
            birthDate: a.data_nascimento || null, // TODO: backend field
            gender: a.genero || null, // TODO: backend field
            age: a.idade,
            grade: a.sala || '',
            class: '', // TODO: extrair de sala ou campo separado
            school: a.escola || '',
            teacher: '', // TODO: buscar nome pelo professor_id
            schedule: '', // TODO: backend field
            specialNeeds: a.necessidade ? [a.necessidade] : [],
            accommodations: a.observacoes || '',
            learningObjectives: '', // TODO: backend field
            currentLevel: '', // TODO: backend field
            overallProgress: null, // TODO: backend field
            lastAssessment: '', // TODO: backend field
            address: '', // TODO: backend field
            phone: a.telefone_contato || '',
            emergencyContact: {
              name: a.contato_emergencia_nome || '',
              phone: a.contato_emergencia_telefone || '',
              relationship: a.contato_emergencia_parentesco || '',
            },
            medicalInfo: a.informacoes_medicas || '',
            allergies: '', // TODO: backend field
            medications: '', // TODO: backend field
          });
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

            <div className="mt-8">
              {ActiveTabComponent && (
                <ActiveTabComponent
                  student={student}
                  currentUser={currentUser}
                  onUpdateStudent={handleUpdateStudent}
                  onUpdateAcademicInfo={handleUpdateAcademicInfo}
                  planos={planos}
                  historico={historico}
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
