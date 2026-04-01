# CLAUDE.md — Frontend EduInclusiva

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
│   ├── api.js              ← instância Axios centralizada + interceptors JWT
│   └── auth.js             ← funções login(), logout()
├── components/
│   ├── AppIcon.jsx          ← wrapper do lucide-react
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Modal.jsx        ← modal genérico (prop: open, onClose, title, size)
│       ├── MainNavigation.jsx
│       ├── BreadcrumbNavigation.jsx
│       ├── DialogForm.jsx   ← formulário de criação de atividade
│       └── StudentForm.jsx  ← formulário de cadastro de aluno (conectado ao backend)
├── hooks/
│   └── useAuth.js           ← hook centralizado de autenticação por role
├── pages/
│   ├── login/
│   │   ├── index.jsx
│   │   └── components/
│   │       ├── LoginHeader.jsx
│   │       └── LoginForm.jsx   ← faz login real na API, salva token + currentUser
│   ├── teacher-dashboard/
│   │   ├── index.jsx           ← dashboard principal do professor
│   │   └── components/
│   │       ├── StudentCard.jsx       ← card do aluno (usa Modal para histórico)
│   │       ├── TeachingPlanPanel.jsx
│   │       ├── ActivityTemplateLibrary.jsx
│   │       ├── QuickActionsPanel.jsx
│   │       ├── CalendarView.jsx
│   │       └── ActivityBuilder.jsx   ← modal de criação de atividade detalhada
│   ├── coordinator-dashboard/
│   │   ├── index.jsx           ← dashboard do coordenador (dados mockados)
│   │   └── components/
│   │       ├── SchoolMetrics.jsx
│   │       ├── FilterControls.jsx
│   │       ├── CalendarWidget.jsx
│   │       └── AnnouncementPanel.jsx
│   ├── secretary-dashboard/
│   │   ├── index.jsx           ← dashboard da secretária (dados mockados)
│   │   └── components/
│   │       ├── NetworkOverview.jsx
│   │       ├── SchoolCard.jsx
│   │       ├── AnalyticsChart.jsx
│   │       ├── FilterControls.jsx
│   │       ├── AlertsPanel.jsx
│   │       └── QuickActions.jsx
│   ├── parent-portal/
│   │   ├── index.jsx           ← portal da família (dados mockados)
│   │   └── components/
│   │       ├── StudentProgressCard.jsx
│   │       ├── SchoolAnnouncementsCard.jsx
│   │       ├── HomeActivitiesCard.jsx
│   │       ├── CommunicationPanel.jsx
│   │       ├── ProgressChart.jsx
│   │       └── EducationalResourcesCard.jsx
│   ├── student-profile/
│   │   ├── index.jsx           ← perfil completo do aluno (dados mockados — precisa conectar)
│   │   └── components/         ← abas: Informações, Acadêmico, Progresso, Atividades, Comunicação
│   └── not-found/
│       └── index.jsx
├── styles/
│   ├── index.css
│   └── tailwind.css
├── utils/
│   └── cn.js
├── App.jsx
├── Routes.jsx              ← definição de rotas
└── index.jsx
```

## API — Configuração Central (src/api/api.js)
```javascript
// Base URL vem da variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const API_PREFIX = "/v1";

export const api = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  headers: { "Content-Type": "application/json" },
});

// Interceptor JWT — adiciona token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor 401 — redireciona para login
api.interceptors.response.use(res => res, err => {
  if (err?.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.replace("/login");
  }
  return Promise.reject(err);
});
```

**SEMPRE use `api` de `src/api/api.js` para chamadas HTTP. NUNCA use `fetch` diretamente ou `axios` sem a instância centralizada.**

## Variáveis de Ambiente (Vercel)
```
VITE_API_BASE_URL = https://backend-eduinclusiva-v1.onrender.com
```

## Autenticação e Roles

### Fluxo de Login
1. `LoginForm` chama `login(email, senha)` de `src/api/auth.js`
2. Backend retorna `{ access_token, token_type, expires_in }`
3. Token salvo em `localStorage` como `"token"`
4. `GET /v1/auth/me` busca dados do usuário logado
5. `currentUser` salvo em `localStorage` como JSON:
```javascript
{
  id: number,
  name: string,    // nome do usuário
  email: string,
  role: string     // role mapeado para o frontend
}
```

### Mapeamento de Roles (Backend → Frontend)
```javascript
const roleMap = {
  "secretaria":   "secretary",
  "coordenadora": "coordinator",
  "professor":    "teacher",
  "familia":      "parent",
  "responsavel":  "parent",
  "responsável":  "parent",
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

### Hook de Autenticação (src/hooks/useAuth.js)
```javascript
// Uso nos dashboards:
const { currentUser, loading } = useAuth(['teacher']);        // só professor
const { currentUser, loading } = useAuth(['coordinator', 'secretary']); // coord ou secretária
const { currentUser, loading } = useAuth(['parent']);         // só família
const { currentUser, loading } = useAuth();                   // qualquer autenticado
```
Redireciona automaticamente para `/login` se não autenticado ou role não permitido.

## Componente Modal (src/components/ui/Modal.jsx)
```javascript
// ✅ USO CORRETO
<Modal
  open={isOpen}        // boolean — controla abertura
  onClose={() => setIsOpen(false)}
  title="Título"
  size="md"            // "sm" | "md" | "lg"
>
  {/* conteúdo */}
</Modal>

// ❌ NUNCA use DialogForm como modal — ele não tem prop isOpen e abre automaticamente
```

## Estado dos Dados por Página

### teacher-dashboard ✅ Conectado ao backend
- Lista alunos reais via `GET /v1/alunos/`
- Cadastra alunos via `POST /v1/alunos/` (StudentForm)
- Gera plano IA via `POST /v1/ai/gerar_plano`
- Histórico de planos via `GET /v1/ai/historico/{id}` (no StudentCard)
- Upload PDF via `POST /v1/pdf/ingest`

### student-profile ⚠️ DADOS MOCKADOS — PRECISA CONECTAR
- Deve buscar `GET /v1/alunos/{id}` para dados básicos
- Deve buscar `GET /v1/planos/{aluno_id}` para planos
- Deve buscar `GET /v1/ai/historico/{aluno_id}` para histórico IA
- Campos que ainda não existem no backend (deixar vazio com TODO):
  - foto/avatar, matrícula, data_nascimento, genero
  - endereco, telefone_contato
  - contato_emergencia (nome, telefone, parentesco)
  - informacoes_medicas (diagnóstico, alergias, medicamentos)
  - atividades avulsas (separadas de planos)
  - comunicações professor-família

### coordinator-dashboard ⚠️ Dados mockados
### secretary-dashboard ⚠️ Dados mockados
### parent-portal ⚠️ Dados mockados

## Campos Reais do Aluno no Backend
```javascript
{
  id: number,
  nome: string,
  idade: number | null,
  necessidade: string | null,  // "Autismo leve", "Dislexia", "TDAH"...
  observacoes: string | null,
  escola: string | null,
  sala: string | null,          // "Sala A - 2º Ano"
  professor_id: number | null,
  criado_em: string,            // ISO datetime
}
```

## Endpoints do Backend Disponíveis
```
POST /v1/auth/login           → { access_token, token_type, expires_in }
POST /v1/auth/register        → { access_token, token_type, expires_in }
GET  /v1/auth/me              → { id, nome, email, papel }

GET  /v1/alunos/              → lista de alunos do professor
GET  /v1/alunos/{id}          → dados do aluno
POST /v1/alunos/              → cria aluno
PUT  /v1/alunos/{id}          → atualiza aluno
DELETE /v1/alunos/{id}        → remove aluno

POST /v1/ai/gerar_plano       → gera plano adaptado via IA
GET  /v1/ai/historico/{id}    → histórico de planos IA do aluno

GET  /v1/planos/{aluno_id}    → planos do aluno

POST /v1/pdf/ingest           → upload e indexação de PDF
```

## Regras Importantes

### Nunca faça isso:
```javascript
// ❌ URL hardcoded
fetch("http://localhost:8000/v1/alunos")

// ❌ Axios sem instância centralizada
import axios from "axios";
axios.get("/v1/alunos")

// ❌ DialogForm como modal
<DialogForm isOpen={...} />  // não tem essa prop

// ❌ Hook após return condicional
if (!open) return null;
useEffect(...) // viola regras do React
```

### Sempre faça assim:
```javascript
// ✅ Usar instância centralizada
import { api } from "../../api/api";
const { data } = await api.get("/alunos/");

// ✅ Modal com prop open
<Modal open={isOpen} onClose={handleClose} title="...">

// ✅ Hooks antes de returns condicionais
useEffect(...);
if (!open) return null;
```

## Navegação para Perfil do Aluno
O professor deve conseguir clicar no card do aluno e ir para `/student-profile/:id`.
```javascript
// No teacher-dashboard, ao clicar no card:
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
navigate(`/student-profile/${student.id}`);

// Na página student-profile:
import { useParams } from "react-router-dom";
const { id } = useParams();
// buscar GET /v1/alunos/{id}
```

## Problemas Já Resolvidos (não reverter)
- ✅ `Modal.jsx` — useEffect antes do return condicional
- ✅ `StudentCard.jsx` — usa `Modal` ao invés de `DialogForm`
- ✅ `vercel.json` — rewrite para SPA routing
- ✅ CORS — `ALLOW_ORIGIN_REGEX` no Render
- ✅ `VITE_API_BASE_URL` no Vercel
- ✅ Case-sensitivity — `Modal.jsx` com M maiúsculo
- ✅ `isDialogOpen` state declarado no teacher-dashboard
- ✅ `useAuth` hook centralizado em src/hooks/useAuth.js

## Usuário de Teste
```
Email: leo@eduinclusiva.com
Senha: Teste123!
Role:  professor (teacher no frontend)
```
