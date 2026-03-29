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

const StudentProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const navigate = useNavigate();
  const { studentId } = useParams();

  // Database of all students
  const getStudentDatabase = () => ({
    'STU001': {
      id: 'STU001',
      name: 'João Pedro Silva',
      registrationNumber: '2024001001',
      photo: "https://images.unsplash.com/photo-1689082511794-8145fb959503",
      photoAlt: 'Foto de perfil de João Pedro, menino de 8 anos com cabelo castanho e sorriso alegre',
      birthDate: '2017-03-15',
      gender: 'masculino',
      age: 8,
      grade: '2º Ano',
      class: 'A',
      school: 'EMEF Prof. Maria Montessori',
      teacher: 'Ana Paula Santos',
      schedule: 'Manhã (7h-12h)',
      specialNeeds: ['Autismo Leve', 'Hipersensibilidade Auditiva'],
      accommodations: `Ambiente com baixo ruído, uso de protetores auriculares quando necessário, rotinas bem estabelecidas, comunicação visual com pictogramas, pausas sensoriais regulares, apoio individualizado para atividades sociais.`,
      learningObjectives: `Desenvolver habilidades de comunicação social, melhorar tolerância a estímulos auditivos, fortalecer autonomia nas atividades diárias, desenvolver habilidades acadêmicas básicas através de métodos visuais.`,
      currentLevel: 'Básico',
      overallProgress: 78,
      lastAssessment: '25/10/2024',
      address: 'Rua das Palmeiras, 456 - Vila Nova - Iperó/SP',
      phone: '(15) 98765-1234',
      emergencyContact: {
        name: 'Carlos Silva',
        phone: '(15) 99876-1234',
        relationship: 'Pai'
      },
      medicalInfo: `Diagnóstico de Transtorno do Espectro Autista (TEA) nível 1. Acompanhamento com neurologista e terapeuta ocupacional. Sensibilidade auditiva moderada.`,
      allergies: 'Não possui alergias conhecidas',
      medications: 'Não faz uso de medicação contínua.'
    },
    'STU002': {
      id: 'STU002', 
      name: 'Maria Fernanda Costa',
      registrationNumber: '2024001002',
      photo: "https://images.unsplash.com/photo-1649029767409-034e3ba696da",
      photoAlt: 'Foto de perfil de Maria Fernanda, menina de 7 anos com cabelo loiro e óculos',
      birthDate: '2018-06-22',
      gender: 'feminino',
      age: 7,
      grade: '1º Ano',
      class: 'A',
      school: 'EMEF Prof. Maria Montessori',
      teacher: 'Ana Paula Santos',
      schedule: 'Manhã (7h-12h)',
      specialNeeds: ['Deficiência Visual Parcial'],
      accommodations: `Material didático em braile e com fonte ampliada, ambiente com boa iluminação, pausas regulares durante atividades longas, uso de recursos táteis para aprendizagem, tempo adicional para realização de tarefas.`,
      learningObjectives: `Desenvolver habilidades de leitura através de método braile e recursos táteis, melhorar orientação e mobilidade, fortalecer autonomia em tarefas do dia a dia, desenvolver habilidades sociais.`,
      currentLevel: 'Básico',
      overallProgress: 82,
      lastAssessment: '20/10/2024',
      address: 'Rua das Flores, 123 - Jardim Esperança - Iperó/SP',
      phone: '(15) 98765-4321',
      emergencyContact: {
        name: 'Ana Costa',
        phone: '(15) 99876-5432',
        relationship: 'Mãe'
      },
      medicalInfo: `Diagnóstico de deficiência visual parcial (baixa visão) desde o nascimento. Acompanhamento com oftalmologista pediátrico e orientador de mobilidade.`,
      allergies: 'Alergia a amendoim',
      medications: 'Suplementação de vitamina A conforme orientação médica.'
    },
    'STU003': {
      id: 'STU003',
      name: 'Carlos Eduardo Santos',
      registrationNumber: '2024001003', 
      photo: "https://images.unsplash.com/photo-1727798450911-4f99a48cd03b",
      photoAlt: 'Foto de perfil de Carlos Eduardo, menino de 9 anos com cabelo escuro e sorriso tímido',
      birthDate: '2016-12-08',
      gender: 'masculino',
      age: 9,
      grade: '3º Ano',
      class: 'A',
      school: 'EMEF Prof. Maria Montessori',
      teacher: 'Ana Paula Santos',
      schedule: 'Manhã (7h-12h)',
      specialNeeds: ['Deficiência Intelectual Leve'],
      accommodations: `Atividades adaptadas ao nível cognitivo, instruções claras e simples, uso de recursos visuais, tempo adicional para atividades, apoio individualizado, reforço positivo constante.`,
      learningObjectives: `Desenvolver habilidades acadêmicas básicas adequadas ao seu nível, melhorar autonomia pessoal, fortalecer habilidades sociais e de comunicação, desenvolver habilidades de vida prática.`,
      currentLevel: 'Básico',
      overallProgress: 65,
      lastAssessment: '18/10/2024',
      address: 'Av. Brasil, 789 - Centro - Iperó/SP',
      phone: '(15) 98765-7890',
      emergencyContact: {
        name: 'Rosa Santos',
        phone: '(15) 99876-7890',
        relationship: 'Mãe'
      },
      medicalInfo: `Diagnóstico de deficiência intelectual leve. Acompanhamento com neurologista e psicopedagoga. Desenvolvimento dentro dos padrões esperados.`,
      allergies: 'Não possui alergias conhecidas',
      medications: 'Não faz uso de medicação contínua.'
    },
    'STU004': {
      id: 'STU004',
      name: 'Ana Beatriz Lima',
      registrationNumber: '2024001004',
      photo: "https://images.unsplash.com/photo-1560611230-20b57c1b55d5",
      photoAlt: 'Foto de perfil de Ana Beatriz, menina de 10 anos com cabelo cacheado e aparelho auditivo',
      birthDate: '2015-01-14',
      gender: 'feminino',
      age: 10,
      grade: '5º Ano',
      class: 'B',
      school: 'EMEF Prof. Maria Montessori',
      teacher: 'Carlos Eduardo Lima',
      schedule: 'Manhã (7h-12h)',
      specialNeeds: ['Deficiência Auditiva Moderada'],
      accommodations: `Uso de aparelho auditivo, posicionamento próximo ao professor, comunicação através de LIBRAS e leitura labial, material visual complementar, intérprete quando necessário.`,
      lerningObjectives: `Desenvolver fluência em LIBRAS, melhorar habilidades de leitura labial, fortalecer aprendizagem através de recursos visuais, desenvolver autonomia comunicativa.`,
      currentLevel: 'Intermediário',
      overallProgress: 73,
      lastAssessment: '22/10/2024',
      address: 'Rua das Acácias, 321 - Jardim São João - Iperó/SP',
      phone: '(15) 98765-3210',
      emergencyContact: {
        name: 'Paulo Lima',
        phone: '(15) 99876-3210',
        relationship: 'Pai'
      },
      medicalInfo: `Perda auditiva neurossensorial bilateral moderada. Uso de aparelhos auditivos bilaterais. Acompanhamento com otorrinolaringologista e fonoaudióloga.`,
      allergies: 'Alergia a frutos do mar',
      medications: 'Não faz uso de medicação contínua.'
    },
    'STU005': {
      id: 'STU005',
      name: 'Pedro Henrique Oliveira',
      registrationNumber: '2024001005',
      photo: "https://images.unsplash.com/photo-1698787069911-fe3047094e7b",
      photoAlt: 'Foto de perfil de Pedro Henrique, menino de 10 anos com cabelo escuro e expressão concentrada',
      birthDate: '2015-09-30',
      gender: 'masculino',
      age: 10,
      grade: '4º Ano',
      class: 'B',
      school: 'EMEF Prof. Maria Montessori',
      teacher: 'Carlos Eduardo Lima',
      schedule: 'Manhã (7h-12h)',
      specialNeeds: ['TDAH', 'Dislexia'],
      accommodations: `Pausas frequentes durante atividades, ambiente com menos distrações, material adaptado para dislexia, tempo adicional para leitura e escrita, apoio com estratégias de organização.`,
      learningObjectives: `Melhorar habilidades de leitura e escrita através de métodos multissensoriais, desenvolver estratégias de autorregulação, fortalecer habilidades de concentração e foco.`,
      currentLevel: 'Intermediário',
      overallProgress: 69,
      lastAssessment: '19/10/2024',
      address: 'Rua dos Ipês, 654 - Vila Esperança - Iperó/SP',
      phone: '(15) 98765-6540',
      emergencyContact: {
        name: 'Marcia Oliveira',
        phone: '(15) 99876-6540',
        relationship: 'Mãe'
      },
      medicalInfo: `Diagnóstico de TDAH e Dislexia. Acompanhamento com neurologista, psicóloga e psicopedagoga. Tratamento com medicação para TDAH.`,
      allergies: 'Não possui alergias conhecidas',
      medications: 'Metilfenidato 10mg - 1x ao dia pela manhã (para TDAH).'
    },
    'STU006': {
      id: 'STU006',
      name: 'Sofia Almeida',
      registrationNumber: '2024001006',
      photo: "https://images.unsplash.com/photo-1533071663966-d8ed964f9ae3",
      photoAlt: 'Foto de perfil de Sofia, menina de 6 anos com cabelo liso e sorriso doce',
      birthDate: '2019-05-17',
      gender: 'feminino',
      age: 6,
      grade: '1º Ano',
      class: 'C',
      school: 'EMEF Prof. Maria Montessori',
      teacher: 'Fernanda Oliveira',
      schedule: 'Manhã (7h-12h)',
      specialNeeds: ['Deficiência Física Leve', 'Atraso no Desenvolvimento Motor'],
      accommodations: `Adaptações no mobiliário escolar, materiais de apoio para coordenação motora, atividades de fisioterapia integradas, tempo adicional para atividades motoras.`,
      learningObjectives: `Desenvolver coordenação motora fina e grossa, melhorar força e resistência muscular, fortalecer autonomia nas atividades diárias, desenvolver habilidades acadêmicas básicas.`,
      currentLevel: 'Básico',
      overallProgress: 88,
      lastAssessment: '24/10/2024',
      address: 'Rua das Violetas, 987 - Jardim Primavera - Iperó/SP',
      phone: '(15) 98765-9870',
      emergencyContact: {
        name: 'João Almeida',
        phone: '(15) 99876-9870',
        relationship: 'Pai'
      },
      medicalInfo: `Paralisia cerebral leve com comprometimento motor. Acompanhamento com fisioterapeuta, terapeuta ocupacional e ortopedista pediátrico.`,
      allergies: 'Alergia a látex',
      medications: 'Suplemento vitamínico conforme orientação médica.'
    },
    'STU007': {
      id: 'STU007',
      name: 'Isabela Ferreira',
      registrationNumber: '2024001007',
      photo: "https://images.unsplash.com/photo-1533071663966-d8ed964f9ae3",
      photoAlt: 'Foto de perfil de Isabela, menina de 6 anos com cabelo cacheado e sorriso doce',
      birthDate: '2019-11-03',
      gender: 'feminino',
      age: 6,
      grade: '1º Ano',
      class: 'A',
      school: 'EMEF Prof. Maria Montessori',
      teacher: 'Ana Paula Santos',
      schedule: 'Manhã (7h-12h)',
      specialNeeds: ['TDAH', 'Dificuldade de Concentração'],
      accommodations: `Ambiente estruturado com menos estímulos visuais, pausas regulares, atividades curtas e variadas, uso de fidget toys, reforço positivo constante.`,
      learningObjectives: `Melhorar capacidade de atenção e concentração, desenvolver autorregulação emocional, fortalecer habilidades acadêmicas básicas, desenvolver habilidades sociais.`,
      currentLevel: 'Básico',
      overallProgress: 73,
      lastAssessment: '21/10/2024',
      address: 'Rua dos Cravos, 159 - Vila Nova - Iperó/SP',
      phone: '(15) 98765-1590',
      emergencyContact: {
        name: 'Sandra Ferreira',
        phone: '(15) 99876-1590',
        relationship: 'Mãe'
      },
      medicalInfo: `Diagnóstico de TDAH. Acompanhamento com neurologista infantil e psicóloga. Tratamento comportamental em desenvolvimento.`,
      allergies: 'Não possui alergias conhecidas',
      medications: 'Não faz uso de medicação contínua no momento.'
    },
    'STU008': {
      id: 'STU008',
      name: 'Lucas Gabriel Santos',
      registrationNumber: '2024001008',
      photo: "https://images.unsplash.com/photo-1727798450911-4f99a48cd03b",
      photoAlt: 'Foto de perfil de Lucas Gabriel, menino de 9 anos com cabelo escuro e sorriso tímido',
      birthDate: '2016-07-25',
      gender: 'masculino',
      age: 9,
      grade: '4º Ano',
      class: 'B',
      school: 'EMEF Prof. Maria Montessori',
      teacher: 'Carlos Eduardo Lima',
      schedule: 'Manhã (7h-12h)',
      specialNeeds: ['Deficiência Intelectual Leve', 'Atraso na Fala'],
      accommodations: `Comunicação através de pictogramas e gestos, atividades adaptadas ao nível cognitivo, terapia da fala integrada, apoio individualizado constante.`,
      learningObjectives: `Desenvolver habilidades de comunicação verbal e não-verbal, melhorar compreensão e expressão, fortalecer habilidades acadêmicas básicas, desenvolver autonomia pessoal.`,
      currentLevel: 'Básico',
      overallProgress: 76,
      lastAssessment: '23/10/2024',
      address: 'Rua das Rosas, 753 - Centro - Iperó/SP',
      phone: '(15) 98765-7530',
      emergencyContact: {
        name: 'Lucia Santos',
        phone: '(15) 99876-7530',
        relationship: 'Mãe'
      },
      medicalInfo: `Deficiência intelectual leve com atraso na aquisição da linguagem. Acompanhamento com fonoaudióloga, neurologista e psicopedagoga.`,
      allergies: 'Alergia a corantes alimentares',
      medications: 'Não faz uso de medicação contínua.'
    },
    'STU009': {
      id: 'STU009',
      name: 'Miguel Costa',
      registrationNumber: '2024001009',
      photo: "https://images.unsplash.com/photo-1727449843811-065c2723cc32",
      photoAlt: 'Foto de perfil de Miguel, menino de 7 anos com cabelo castanho e sorriso alegre',
      birthDate: '2018-04-11',
      gender: 'masculino',
      age: 7,
      grade: '2º Ano',
      class: 'C',
      school: 'EMEF Prof. Maria Montessori',
      teacher: 'Fernanda Oliveira',
      schedule: 'Manhã (7h-12h)',
      specialNeeds: ['Síndrome de Down'],
      accommodations: `Atividades adaptadas ao ritmo de aprendizagem, uso de recursos visuais e concretos, fisioterapia e terapia ocupacional integradas, apoio individualizado.`,
      learningObjectives: `Desenvolver habilidades acadêmicas funcionais, melhorar autonomia pessoal e social, fortalecer habilidades de comunicação, desenvolver coordenação motora.`,
      currentLevel: 'Básico',
      overallProgress: 82,
      lastAssessment: '26/10/2024',
      address: 'Av. das Américas, 852 - Jardim América - Iperó/SP',
      phone: '(15) 98765-8520',
      emergencyContact: {
        name: 'Roberto Costa',
        phone: '(15) 99876-8520',
        relationship: 'Pai'
      },
      medicalInfo: `Síndrome de Down (Trissomia do cromossomo 21). Acompanhamento com cardiologista, endocrinologista, fisioterapeuta e fonoaudióloga. Desenvolvimento dentro do esperado.`,
      allergies: 'Não possui alergias conhecidas',
      medications: 'Levotiroxina 25mcg - 1x ao dia (hipotireoidismo).'
    }
  });

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user?.role) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    // Get student ID from URL params or query params (backward compatibility)
    let targetStudentId = studentId;
    
    if (!targetStudentId) {
      const urlParams = new URLSearchParams(window.location.search);
      targetStudentId = urlParams?.get('id');
    }

    // Get student data from database
    const studentDatabase = getStudentDatabase();
    const studentData = studentDatabase?.[targetStudentId];

    if (studentData) {
      setStudent(studentData);
    } else {
      // If no specific student ID, show default student (Ana Clara)
      setStudent({
        id: 'STU_DEFAULT',
        name: 'Ana Clara Santos Silva',
        registrationNumber: '2024001234',
        photo: "https://images.unsplash.com/photo-1649029767409-034e3ba696da",
        photoAlt: 'Foto de perfil de Ana Clara, menina de 8 anos com cabelo loiro, óculos e sorriso doce',
        birthDate: '2016-03-15',
        gender: 'feminino',
        age: 8,
        grade: '2º Ano',
        class: 'B',
        school: 'EMEF Prof. Maria Montessori',
        teacher: 'Ana Silva',
        schedule: 'Manhã (7h-12h)',
        specialNeeds: ['Deficiência Visual Parcial', 'Dificuldade de Concentração'],
        accommodations: `Material didático em braile e com fonte ampliada, ambiente com boa iluminação, pausas regulares durante atividades longas, uso de recursos táteis para aprendizagem, tempo adicional para realização de tarefas, apoio individualizado quando necessário.`,
        learningObjectives: `Desenvolver habilidades de leitura através de método braile e recursos táteis, melhorar a capacidade de concentração em atividades dirigidas, fortalecer a autonomia em tarefas do dia a dia, aprimorar habilidades sociais e de interação com colegas, desenvolver mobilidade e orientação espacial.`,
        currentLevel: 'Básico',
        overallProgress: 78,
        lastAssessment: '15/10/2024',
        address: 'Rua das Flores, 123 - Jardim Esperança - Iperó/SP',
        phone: '(15) 98765-4321',
        emergencyContact: {
          name: 'Maria Santos Silva',
          phone: '(15) 99876-5432',
          relationship: 'Mãe'
        },
        medicalInfo: `Diagnóstico de deficiência visual parcial (baixa visão) desde o nascimento. Acompanhamento com oftalmologista pediátrico e terapeuta ocupacional. Necessita de ambiente com boa iluminação e recursos de ampliação para melhor aproveitamento visual.`,
        allergies: 'Alergia a amendoim e frutos do mar',
        medications: 'Não faz uso de medicação contínua. Suplementação de vitamina A conforme orientação médica.'
      });
    }

    setLoading(false);
  }, [navigate, studentId]);

  const tabs = [
  {
    id: 'personal',
    label: 'Informações Pessoais',
    icon: 'User',
    component: PersonalInfoTab
  },
  {
    id: 'academic',
    label: 'Dados Acadêmicos',
    icon: 'GraduationCap',
    component: AcademicInfoTab
  },
  {
    id: 'progress',
    label: 'Progresso',
    icon: 'TrendingUp',
    component: ProgressTab
  },
  {
    id: 'activities',
    label: 'Atividades',
    icon: 'BookOpen',
    component: ActivitiesTab
  },
  {
    id: 'communication',
    label: 'Comunicação',
    icon: 'MessageCircle',
    component: CommunicationTab
  }];


  const handleUpdateStudent = (updatedData) => {
    setStudent((prev) => ({ ...prev, ...updatedData }));
    // In a real app, you would send this to your backend
    console.log('Updating student data:', updatedData);
  };

  const handleUpdateAcademicInfo = (updatedData) => {
    setStudent((prev) => ({ ...prev, ...updatedData }));
    // In a real app, you would send this to your backend
    console.log('Updating academic info:', updatedData);
  };

  const handleEditProfile = () => {
    // Navigate to edit mode or open edit modal
    console.log('Edit profile clicked');
  };

  const handleUploadPhoto = () => {
    // Handle photo upload
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
      </div>);

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
      </div>);

  }

  const ActiveTabComponent = tabs?.find((tab) => tab?.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={handleToggleNavCollapse} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          {/* Student Header */}
          <StudentHeader
            student={student}
            currentUser={currentUser}
            onEditProfile={handleEditProfile}
            onUploadPhoto={handleUploadPhoto} />


          {/* Navigation Tabs */}
          <div className="mt-8">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) =>
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-educational ${
                  activeTab === tab?.id ?
                  'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}`
                  }>

                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {ActiveTabComponent &&
              <ActiveTabComponent
                student={student}
                currentUser={currentUser}
                onUpdateStudent={handleUpdateStudent}
                onUpdateAcademicInfo={handleUpdateAcademicInfo} />

              }
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default StudentProfile;