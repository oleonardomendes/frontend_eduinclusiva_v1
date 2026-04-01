# CLAUDE.md — Frontend EduInclusiva
> Última atualização: Abril 2026

## Visão Geral
Frontend da plataforma EduInclusiva — sistema de gestão educacional inclusiva para alunos com necessidades educacionais especiais (NEE), aprovado pela Prefeitura Municipal de São Paulo.

## Stack Técnica
- **Framework:** React 18 + Vite
- **Estado:** Redux Toolkit
- **Roteamento:** React Router v6
- **Estilo:** TailwindCSS (utility classes apenas — sem compiler customizado)
- **Animações:** Framer Motion
- **Gráficos:** Recharts + D3.js
- **Formulários:** React Hook Form
- **HTTP:** Axios (instância centralizada em src/api/api.js)
- **Deploy:** Vercel — URL: https://frontend-eduinclusiva-v1.vercel.app
- **Repo GitHub:** oleonardomendes/frontend_eduinclusiva_v1 (branch: main)

## Estrutura de Pastas
```
src/
├── api/
│   ├── api.js              ← instância Axios + interceptors JWT + funções de API
│   └── auth.js             ← login(), logout()
├── components/
│   ├── AppIcon.jsx         ← wrapper lucide-react
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Modal.jsx        ← modal genérico (props: open, onClose, title, size)
│       ├── MainNavigation.jsx
│       ├── BreadcrumbNavigation.jsx
│       ├── DialogForm.jsx   ← formulário de criação de atividade (NÃO usar como modal)
│       └── StudentForm.jsx  ← formulário de cadastro de aluno (conectado ao backend)
├── hooks/
│   └── useAuth.js           ← hook centralizado de autenticação por role
├── pages/
│   ├── login/
│   │   ├── index.jsx
│   │   └── components/
│   │       ├── LoginHeader.jsx
│   │       └── LoginForm.jsx   ← login real na API, salva token + currentUser
│   ├── teacher-dashboard/
│   │   ├── index.jsx           ← ✅ conectado ao backend
│   │   └── components/
│   │       ├── StudentCard.jsx       ← usa Modal para histórico de planos
│   │       ├── TeachingPlanPanel.jsx ← dados mockados (TODO)
│   │       ├── ActivityTemplateLibrary.jsx
│   │       ├── QuickActionsPanel.jsx
│   │       ├── CalendarView.jsx      ← dados mockados (TODO)
│   │       └── ActivityBuilder.jsx   ← modal de criação de atividade
│   ├── coordinator-dashboard/
│   │   ├── index.jsx           ← ❌ 100% mockado
│   │   └── components/
│   │       ├── SchoolMetrics.jsx
│   │       ├── FilterControls.jsx
│   │       ├── CalendarWidget.jsx
│   │       └── AnnouncementPanel.jsx
│   ├── secretary-dashboard/
│   │   ├── index.jsx           ← ❌ 100% mockado
│   │   └── components/
│   │       ├── NetworkOverview.jsx
│   │       ├── SchoolCard.jsx
│   │       ├── AnalyticsChart.jsx
│   │       ├── FilterControls.jsx
│   │       ├── AlertsPanel.jsx
│   │       └── QuickActions.jsx
│   ├── parent-portal/
│   │   ├── index.jsx           ← ❌ 100% mockado
│   │   └── components/
│   │       ├── StudentProgressCard.jsx
│   │       ├── SchoolAnnouncementsCard.jsx
│   │       ├── HomeActivitiesCard.jsx
│   │       ├── CommunicationPanel.jsx
│   │       ├── ProgressChart.jsx
│   │       └── EducationalResourcesCard.jsx
│   ├── student-profile/
│   │   ├── index.jsx           ← ✅ conectado ao backend (Abril 2026)
│   │   └── components/
│   │       ├── PersonalInfoTab.jsx    ← dados reais do backend
│   │       ├── AcademicInfoTab.jsx    ← dados reais do backend
│   │       ├── ProgressTab.jsx        ← metricas.total_planos real; gráficos mockados
│   │       ├── ActivitiesTab.jsx      ← planos reais via GET /v1/planos/{id}
│   │       └── CommunicationTab.jsx   ← ❌ mockado (endpoint não existe ainda)
│   └── not-found/
│       └── index.jsx
├── styles/
├── utils/
│   └── cn.js
├── App.jsx
├── Routes.jsx
└── index.jsx
```

## API — Configuração Central (src/api/api.js)
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const API_PREFIX = "/v1";

export const api = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  headers: { "Content-Type": "application/json" },
});

// Token JWT automático
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 → redireciona para login
api.interceptors.response.use(res => res, err => {
  if (err?.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.replace("/login");
  }
  return Promise.reject(err);
});

// Funções disponíveis em api.js:
export async function getAlunos()              // GET /v1/alunos/
export async function createAluno(aluno)       // POST /v1/alunos/
export async function gerarPlanoAdaptado(payload) // POST /v1/ai/gerar_plano
export async function getHistoricoPlanos(id)   // GET /v1/ai/historico/{id}
export async function getAlunoMetricas(id)     // GET /v1/alunos/{id}/metricas
export async function uploadPDF(file, alunoId) // POST /v1/pdf/ingest
```

**SEMPRE use `api` de `src/api/api.js`. NUNCA use `fetch` diretamente.**

## Variáveis de Ambiente (Vercel)
```
VITE_API_BASE_URL = https://backend-eduinclusiva-v1.onrender.com
```

## Autenticação e Roles

### Fluxo de Login
1. `LoginForm` chama `login(email, senha)` de `src/api/auth.js`
2. Backend retorna `{ access_token, token_type, expires_in }`
3. Token salvo em `localStorage` como `"token"`
4. `GET /v1/auth/me` busca dados do usuário
5. `currentUser` salvo em `localStorage`:
```javascript
{ id, name, email, role }
```

### Mapeamento de Roles (Backend → Frontend)
```javascript
const roleMap = {
  "secretaria":   "secretary",
  "coordenadora": "coordinator",
  "professor":    "teacher",
  "familia":      "parent",
  "responsavel":  "parent",
};
```

### Rotas por Role
```javascript
const dashboardRoutes = {
  secretary:   "/secretary-dashboard",
  coordinator: "/coordinator-dashboard",
  teacher:     "/teacher-dashboard",
  parent:      "/parent-portal",
};
```

### Hook useAuth (src/hooks/useAuth.js)
```javascript
const { currentUser, loading } = useAuth(['teacher']);
const { currentUser, loading } = useAuth(['coordinator', 'secretary']);
const { currentUser, loading } = useAuth(['parent']);
const { currentUser, loading } = useAuth(); // qualquer autenticado
```

## Componente Modal (src/components/ui/Modal.jsx)
```javascript
// ✅ CORRETO
<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Título" size="md">
  {/* conteúdo */}
</Modal>

// ❌ NUNCA — DialogForm não tem prop isOpen e abre automaticamente ao montar
<DialogForm isOpen={...} />
```

## Mapeamento de Campos (Backend → Frontend)

### Aluno
| Campo Backend | Campo Frontend | Usado em |
|---------------|----------------|----------|
| `nome` | `student.name` | todos |
| `necessidade` | `student.specialNeeds` | StudentCard, StudentHeader |
| `escola` | `student.school` | StudentHeader, AcademicInfoTab |
| `sala` | `student.class` / `student.grade` | StudentHeader, AcademicInfoTab |
| `professor_nome` | `student.teacher` | StudentHeader, AcademicInfoTab |
| `progresso_geral` | `student.overallProgress` | StudentHeader, ProgressTab |
| `nivel_aprendizado` | `student.currentLevel` | AcademicInfoTab |
| `objetivos_aprendizado` | `student.learningObjectives` | AcademicInfoTab |
| `alergias` | `student.allergies` | PersonalInfoTab |
| `medicamentos` | `student.medications` | PersonalInfoTab |
| `endereco` | `student.address` | PersonalInfoTab |
| `horario_aulas` | `student.schedule` | StudentHeader |
| `matricula` | `student.registrationNumber` | StudentHeader |
| `foto` | `student.photo` | StudentHeader |
| `data_nascimento` | `student.birthDate` | PersonalInfoTab |
| `genero` | `student.gender` | PersonalInfoTab |
| `telefone_contato` | `student.phone` | PersonalInfoTab |
| `contato_emergencia_nome` | `student.emergencyContact.name` | PersonalInfoTab |
| `contato_emergencia_telefone` | `student.emergencyContact.phone` | PersonalInfoTab |
| `contato_emergencia_parentesco` | `student.emergencyContact.relationship` | PersonalInfoTab |
| `informacoes_medicas` | `student.medicalInfo` | PersonalInfoTab |

### Métricas do Aluno (GET /v1/alunos/{id}/metricas)
| Campo Backend | Usado em |
|---------------|----------|
| `progresso_geral` | ProgressTab |
| `nivel_aprendizado` | ProgressTab |
| `ultima_avaliacao` | StudentHeader |
| `total_planos` | ProgressTab |

## Status de Conexão por Página

### ✅ Conectado ao Backend
| Página | O que está conectado |
|--------|---------------------|
| Login | POST /auth/login + GET /auth/me |
| teacher-dashboard | GET/POST /alunos/, POST /ai/gerar_plano, GET /ai/historico/{id}, POST /pdf/ingest |
| student-profile | GET /alunos/{id}, GET /alunos/{id}/metricas, GET /planos/{id}, GET /ai/historico/{id} |

### ❌ Ainda Mockado (prioridade para prefeitura)
| Página | O que falta |
|--------|-------------|
| coordinator-dashboard | Turmas, métricas de escola, anúncios |
| secretary-dashboard | Escolas, métricas da rede, alertas |
| student-profile / CommunicationTab | Mensagens professor-família |
| teacher-dashboard / CalendarView | Eventos pedagógicos |
| teacher-dashboard / TeachingPlanPanel | Métricas de planejamento |

### ❌ Ainda Mockado (projeto público — futuro)
| Página | O que falta |
|--------|-------------|
| parent-portal | Tudo — vinculação responsável→aluno, mensagens, atividades para casa |

## Rotas (Routes.jsx)
```javascript
/login                    → LoginPage
/teacher-dashboard        → TeacherDashboard (role: teacher)
/coordinator-dashboard    → CoordinatorDashboard (role: coordinator, secretary)
/secretary-dashboard      → SecretaryDashboard (role: secretary)
/parent-portal            → ParentPortal (role: parent)
/student-profile/:id      → StudentProfile (navegação do teacher-dashboard)
/student-profile/:studentId → alias existente
/*                        → NotFound
```

## Regras Críticas

### Nunca faça:
```javascript
// ❌ URL hardcoded
fetch("http://localhost:8000/v1/alunos")

// ❌ Axios sem instância centralizada
import axios from "axios";
axios.get("/v1/alunos")

// ❌ DialogForm como modal com isOpen
<DialogForm isOpen={isHistoryOpen} />

// ❌ Hook após return condicional (viola regras do React)
if (!open) return null;
useEffect(...)
```

### Sempre faça:
```javascript
// ✅ Instância centralizada
import { api } from "../../api/api";
const { data } = await api.get("/alunos/");

// ✅ Modal correto
<Modal open={isOpen} onClose={handleClose} title="...">

// ✅ Hooks antes de returns condicionais
useEffect(...);
if (!open) return null;

// ✅ Promise.allSettled para múltiplas chamadas em paralelo
const [r1, r2, r3] = await Promise.allSettled([
  api.get(`/alunos/${id}`),
  api.get(`/alunos/${id}/metricas`),
  api.get(`/planos/${id}`),
]);
```

## Problemas Já Resolvidos (não reverter)
- ✅ `Modal.jsx` — useEffect antes do return condicional
- ✅ `StudentCard.jsx` — usa `Modal` ao invés de `DialogForm`; URL localhost removida
- ✅ `vercel.json` — rewrite para SPA routing
- ✅ CORS — `ALLOW_ORIGIN_REGEX` no Render
- ✅ `VITE_API_BASE_URL` configurado no Vercel
- ✅ Case-sensitivity — `Modal.jsx` com M maiúsculo
- ✅ `isDialogOpen` state declarado no teacher-dashboard
- ✅ `useAuth` hook centralizado em src/hooks/useAuth.js
- ✅ `StudentForm.jsx` — cadastro real de aluno com JWT
- ✅ `student-profile` — conectado ao backend com Promise.allSettled
- ✅ `getAlunoMetricas` adicionado em api.js

## Usuário de Teste
```
Email: leo@eduinclusiva.com
Senha: Teste123!
Role:  professor (teacher no frontend)
ID:    1
Aluno cadastrado: João Pedro Silva (ID: 1)
```

## Próximos Passos (Projeto Prefeitura)
1. Conectar `coordinator-dashboard` ao backend (precisa criar endpoints de turmas/escolas)
2. Conectar `secretary-dashboard` ao backend (precisa criar endpoints de rede/métricas)
3. Implementar comunicação professor-família (novo model + endpoints)
4. Conectar calendário de eventos
5. Implementar métricas reais de progresso por disciplina
