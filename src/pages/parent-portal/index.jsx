import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import StudentProgressCard from './components/StudentProgressCard';
import SchoolAnnouncementsCard from './components/SchoolAnnouncementsCard';
import HomeActivitiesCard from './components/HomeActivitiesCard';
import CommunicationPanel from './components/CommunicationPanel';
import ProgressChart from './components/ProgressChart';
import EducationalResourcesCard from './components/EducationalResourcesCard';
import Icon from '../../components/AppIcon';

const ParentPortal = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
  }, []);

  // Mock student data
  const studentData = {
    name: "Ana Clara Santos",
    class: "3º Ano B",
    school: "EMEF Prof. Maria Montessori",
    specialNeeds: "Autismo, Dificuldades de Comunicação",
    overallProgress: 78,
    subjects: [
      {
        name: "Português",
        progress: 82,
        status: "Excelente progresso na leitura"
      },
      {
        name: "Matemática",
        progress: 75,
        status: "Melhorando nas operações básicas"
      },
      {
        name: "Ciências",
        progress: 80,
        status: "Muito interessada em experimentos"
      }
    ],
    recentActivities: [
      {
        name: "Leitura de história ilustrada",
        completed: true,
        date: "23/10/2025"
      },
      {
        name: "Exercícios de coordenação motora",
        completed: true,
        date: "22/10/2025"
      },
      {
        name: "Atividade de matemática com blocos",
        completed: false,
        date: "21/10/2025"
      }
    ]
  };

  // Mock announcements data
  const announcementsData = [
    {
      id: 1,
      title: "Reunião de Pais - Novembro",
      preview: "Convocamos todos os responsáveis para a reunião mensal...",
      fullContent: `Convocamos todos os responsáveis para a reunião mensal que acontecerá no dia 15 de novembro, às 19h, no auditório da escola.\n\nPauta da reunião:\n- Apresentação do progresso acadêmico dos alunos\n- Planejamento das atividades de dezembro\n- Discussão sobre as adaptações curriculares\n- Orientações para as férias escolares\n\nSua presença é muito importante para o desenvolvimento educacional de seu filho.`,
      date: "23/10/2025",
      priority: "high",
      category: "Reunião",
      requiresResponse: true
    },
    {
      id: 2,
      title: "Semana da Inclusão - Atividades Especiais",
      preview: "De 28 de outubro a 1º de novembro, realizaremos atividades...",
      fullContent: `De 28 de outubro a 1º de novembro, realizaremos atividades especiais em comemoração à Semana da Inclusão.\n\nProgramação:\n- Segunda: Apresentação teatral sobre diversidade\n- Terça: Oficinas de arte adaptada\n- Quarta: Jogos cooperativos no pátio\n- Quinta: Mostra de trabalhos dos alunos\n- Sexta: Festa da inclusão com apresentações\n\nTodos os responsáveis estão convidados a participar das atividades.`,
      date: "22/10/2025",
      priority: "medium",
      category: "Evento",
      requiresResponse: false
    },
    {
      id: 3,
      title: "Alteração no Cardápio da Merenda",
      preview: "Informamos sobre mudanças no cardápio desta semana...",
      fullContent: `Informamos sobre mudanças no cardápio desta semana devido à entrega de novos ingredientes.\n\nNovo cardápio:\n- Segunda: Sopa de legumes com pão integral\n- Terça: Arroz, feijão e frango desfiado\n- Quarta: Macarrão com molho de tomate e queijo\n- Quinta: Polenta com carne moída\n- Sexta: Sanduíche natural e suco de frutas\n\nTodos os pratos são adaptados para atender às necessidades alimentares especiais dos alunos.`,
      date: "21/10/2025",
      priority: "low",
      category: "Alimentação",
      requiresResponse: false
    }
  ];

  // Mock home activities data
  const homeActivitiesData = [
    {
      id: 1,
      title: "Contando com Objetos do Dia a Dia",
      subject: "Matemática",
      difficulty: "Fácil",
      duration: "15-20 min",
      description: "Use objetos da casa para ensinar números e quantidades de forma lúdica.",
      objective: "Desenvolver conceitos básicos de quantidade e numeração",
      materials: [
        "Brinquedos pequenos (carrinhos, bonecas, blocos)",
        "Frutas ou objetos da cozinha",
        "Papel e lápis colorido"
      ],
      steps: [
        "Separe 10 objetos iguais (ex: botões, tampinhas)",
        "Peça para a criança contar um por um, tocando cada objeto",
        "Faça grupos de 2, 3 e 5 objetos",
        "Desenhe os números no papel e associe com a quantidade",
        "Repita com objetos diferentes para fixar o aprendizado"
      ],
      tips: "Use sempre objetos que a criança goste. Se ela se distrair, faça pausas e retome depois. O importante é tornar o aprendizado divertido."
    },
    {
      id: 2,
      title: "História com Figuras",
      subject: "Português",
      difficulty: "Médio",
      duration: "20-30 min",
      description: "Crie uma história usando imagens para desenvolver a comunicação e imaginação.",
      objective: "Estimular a linguagem oral e a criatividade",
      materials: [
        "Revistas ou livros com figuras",
        "Tesoura sem ponta",
        "Cola",
        "Folha de papel grande"
      ],
      steps: [
        "Recorte 5-6 figuras interessantes das revistas",
        "Cole as figuras na folha em sequência",
        "Peça para a criança inventar uma história ligando as figuras",
        "Ajude fazendo perguntas: 'O que aconteceu depois?'",
        "Desenhe ou escreva partes da história junto com ela"
      ],
      tips: "Deixe a criança escolher algumas figuras. Não se preocupe se a história não fizer sentido completo - o importante é ela se expressar."
    },
    {
      id: 3,
      title: "Jardim de Observação",
      subject: "Ciências",
      difficulty: "Fácil",
      duration: "10-15 min diários",
      description: "Observe plantas e insetos para aprender sobre a natureza.",
      objective: "Desenvolver curiosidade científica e observação",
      materials: [
        "Plantas do jardim ou vasos",
        "Lupa (se tiver)",
        "Caderno para desenhos",
        "Lápis de cor"
      ],
      steps: [
        "Escolha uma planta para observar todos os dias",
        "Desenhe a planta no caderno",
        "Procure insetos ou pequenos animais próximos",
        "Converse sobre as cores, formas e texturas",
        "Anote mudanças que observar (crescimento, flores, etc.)"
      ],
      tips: "Transforme em um ritual diário. Faça perguntas simples como 'Que cor é esta folha?' ou 'O que você acha que este inseto está fazendo?'"
    }
  ];

  // Mock communication data
  const messagesData = [
    {
      id: 1,
      subject: "Progresso Excelente em Leitura",
      sender: "Profa. Carla Mendes",
      content: "Gostaria de compartilhar que a Ana Clara tem mostrado um progresso excepcional na leitura. Ela conseguiu ler uma história completa hoje e demonstrou boa compreensão do texto. Continue incentivando a leitura em casa!",
      date: "23/10/2025",
      type: "academic",
      unread: true,
      requiresResponse: false
    },
    {
      id: 2,
      subject: "Comportamento Colaborativo",
      sender: "Profa. Marina Silva",
      content: "A Ana Clara ajudou um colega durante a atividade de matemática hoje. Ela mostrou muita paciência e gentileza. É maravilhoso ver seu desenvolvimento social e emocional!",
      date: "22/10/2025",
      type: "behavior",
      unread: false,
      requiresResponse: false
    },
    {
      id: 3,
      subject: "Reunião Individual Solicitada",
      sender: "Coordenadora Pedagógica",
      content: "Gostaríamos de agendar uma conversa para discutir as adaptações curriculares do próximo bimestre. Por favor, confirme sua disponibilidade para a próxima semana.",
      date: "21/10/2025",
      type: "general",
      unread: false,
      requiresResponse: true
    }
  ];

  const teachersData = [
    {
      id: 1,
      name: "Profa. Carla Mendes",
      subject: "Português e Artes"
    },
    {
      id: 2,
      name: "Profa. Marina Silva",
      subject: "Matemática e Ciências"
    },
    {
      id: 3,
      name: "Profa. Ana Beatriz",
      subject: "Educação Física Adaptada"
    }
  ];

  // Mock progress chart data
  const progressChartData = [
    { month: 'Mai', português: 65, matemática: 58, ciências: 62 },
    { month: 'Jun', português: 70, matemática: 62, ciências: 68 },
    { month: 'Jul', português: 75, matemática: 68, ciências: 72 },
    { month: 'Ago', português: 78, matemática: 70, ciências: 75 },
    { month: 'Set', português: 80, matemática: 73, ciências: 78 },
    { month: 'Out', português: 82, matemática: 75, ciências: 80 }
  ];

  // Mock educational resources data
  const educationalResourcesData = [
    {
      id: 1,
      title: "Atividades de Coordenação Motora",
      description: "Exercícios simples para desenvolver habilidades motoras finas e grossas em casa.",
      type: "activity",
      category: "activities",
      duration: "15-30 min",
      ageGroup: "6-10 anos",
      tags: ["coordenação", "motricidade", "desenvolvimento"]
    },
    {
      id: 2,
      title: "Como Apoiar Crianças com Autismo",
      description: "Guia completo com estratégias práticas para pais de crianças no espectro autista.",
      type: "article",
      category: "tips",
      duration: "10 min leitura",
      ageGroup: "Todas as idades",
      tags: ["autismo", "estratégias", "comunicação"]
    },
    {
      id: 3,
      title: "Jogos Educativos Adaptados",
      description: "Vídeo demonstrando jogos simples que podem ser adaptados para diferentes necessidades.",
      type: "video",
      category: "videos",
      duration: "12 min",
      ageGroup: "5-12 anos",
      tags: ["jogos", "adaptação", "inclusão"]
    },
    {
      id: 4,
      title: "Rotina Visual para Casa",
      description: "Como criar e usar rotinas visuais para ajudar na organização e independência.",
      type: "tip",
      category: "tips",
      duration: "5 min leitura",
      ageGroup: "3-15 anos",
      tags: ["rotina", "visual", "autonomia"]
    },
    {
      id: 5,
      title: "Comunicação Alternativa Básica",
      description: "Introdução aos sistemas de comunicação alternativa e aumentativa para uso doméstico.",
      type: "article",
      category: "articles",
      duration: "15 min leitura",
      ageGroup: "Todas as idades",
      tags: ["comunicação", "CAA", "linguagem"]
    },
    {
      id: 6,
      title: "Brincadeiras Sensoriais",
      description: "Atividades que estimulam os sentidos e ajudam no desenvolvimento sensorial.",
      type: "activity",
      category: "activities",
      duration: "20-45 min",
      ageGroup: "2-8 anos",
      tags: ["sensorial", "brincadeiras", "estímulos"]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Portal dos Responsáveis - Edu+ Inclusiva</title>
        <meta name="description" content="Acompanhe o progresso educacional do seu filho, acesse atividades para casa e mantenha comunicação com os professores." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <MainNavigation onToggleCollapse={handleToggleCollapse} />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BreadcrumbNavigation />
            
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Portal dos Responsáveis
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Acompanhe o desenvolvimento educacional de {studentData?.name}
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-4 text-xs sm:text-sm text-muted-foreground shrink-0">
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} />
                    <span>Última atualização: 23/10/2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Primary Content */}
              <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                {/* Student Progress Card */}
                <StudentProgressCard student={studentData} />

                {/* Progress Chart */}
                <ProgressChart progressData={progressChartData} />

                {/* Home Activities */}
                <HomeActivitiesCard activities={homeActivitiesData} />

                {/* Educational Resources */}
                <EducationalResourcesCard resources={educationalResourcesData} />
              </div>

              {/* Right Column - Secondary Content */}
              <div className="space-y-6 lg:space-y-8">
                {/* School Announcements */}
                <SchoolAnnouncementsCard announcements={announcementsData} />

                {/* Communication Panel */}
                <CommunicationPanel 
                  messages={messagesData} 
                  teachers={teachersData} 
                />
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-8 lg:mt-12 bg-card rounded-lg border border-border shadow-educational p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Zap" size={18} className="sm:size-5 text-primary" />
                <span>Ações Rápidas</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                <button className="flex items-center space-x-3 p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-educational text-left">
                  <Icon name="MessageSquare" size={18} className="sm:size-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base">Falar com Professor</p>
                    <p className="text-xs text-muted-foreground">Envie uma mensagem</p>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-educational text-left">
                  <Icon name="Calendar" size={18} className="sm:size-5 text-secondary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base">Agendar Reunião</p>
                    <p className="text-xs text-muted-foreground">Marque um horário</p>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-educational text-left">
                  <Icon name="Download" size={18} className="sm:size-5 text-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base">Baixar Relatório</p>
                    <p className="text-xs text-muted-foreground">Progresso mensal</p>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-educational text-left">
                  <Icon name="HelpCircle" size={18} className="sm:size-5 text-warning shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base">Precisa de Ajuda?</p>
                    <p className="text-xs text-muted-foreground">Suporte técnico</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ParentPortal;