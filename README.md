🧠 EduInclusiva — Plataforma Inteligente para Educação Inclusiva

EduInclusiva é uma plataforma educacional inovadora desenvolvida para apoiar professores, escolas e famílias na criação de planos e atividades personalizadas para alunos com necessidades educacionais especiais (NEE).
A solução utiliza inteligência artificial (IA) e análise de histórico pedagógico para gerar recomendações e atividades adaptadas, promovendo inclusão, autonomia e aprendizado significativo.

🚀 Tecnologias Principais
🖥️ Frontend

React 18 — UI moderna e performática com rendering concorrente.

Vite — Servidor de desenvolvimento ultrarrápido.

Redux Toolkit — Gerenciamento de estado simplificado e eficiente.

TailwindCSS — Design responsivo e acessível com utilitários prontos.

React Router v6 — Navegação declarativa entre dashboards.

Framer Motion — Animações suaves e interativas.

Recharts & D3.js — Visualizações dinâmicas de progresso e desempenho.

React Hook Form — Formulários reativos e validados.

⚙️ Backend (FastAPI)

Python FastAPI — APIs de alta performance.

PostgreSQL (Supabase) — Banco relacional seguro e escalável.

SQLModel — ORM moderno e tipado.

OpenAI API + RAG (Retrieval-Augmented Generation) — Geração de planos personalizados com base no histórico de cada aluno.

🎯 Principais Funcionalidades

👩‍🏫 Dashboard do Professor: gerenciamento de alunos, planos e atividades adaptadas.

🧒 Perfil do Aluno: histórico, progresso e plano pedagógico individualizado.

🧩 Gerador de Atividades com IA: cria automaticamente atividades personalizadas conforme o perfil do aluno e competências a desenvolver.

🗓️ Calendário Escolar: metas por bimestre e acompanhamento de progresso.

🏫 Painel do Gestor: visão consolidada de escolas, professores e indicadores de inclusão.

👨‍👩‍👧 Portal da Família: acompanhamento de evolução e comunicação com professores.

♿ Design Acessível: interface responsiva, intuitiva e compatível com WCAG.

📋 Pré-requisitos

Antes de iniciar, você precisa ter instalado:

Node.js (v16.x ou superior)

npm ou yarn

Backend configurado (FastAPI + PostgreSQL) em execução local ou hospedado

Exemplo de backend: /backend

🛠️ Instalação e Execução

Instale as dependências

npm install
# ou
yarn install


Configure o ambiente
Crie um arquivo .env na raiz com:

VITE_API_URL=http://localhost:8000


Inicie o servidor de desenvolvimento

npm run dev
# ou
yarn dev


Acesse o app no navegador

http://localhost:5173

📁 Estrutura do Projeto
react_app/
├── public/                 # Arquivos estáticos
├── src/
│   ├── api/                # Conexão com o backend (FastAPI)
│   ├── components/         # Componentes reutilizáveis (UI e lógica)
│   │   └── ui/             # Botões, modais, inputs, etc.
│   ├── pages/              # Páginas e dashboards (Professor, Gestor, etc.)
│   ├── styles/             # Estilos globais e Tailwind config
│   ├── App.jsx             # Componente raiz
│   ├── Routes.jsx          # Rotas principais
│   └── index.jsx           # Ponto de entrada
├── .env                    # Variáveis de ambiente
├── package.json            # Dependências e scripts
├── tailwind.config.js      # Configuração de estilo
└── vite.config.js          # Configuração do build e servidor

💡 Exemplos de Uso
Criar uma Nova Atividade (Professor)

Clique em “Nova Atividade” no Dashboard.

Preencha o formulário (DialogForm.jsx):

Título, categoria, duração, dificuldade e faixa etária.

O sistema enviará os dados para o backend (POST /atividades).

A atividade é salva no banco e exibida na biblioteca do professor.

Gerar Plano com IA

No dashboard, selecione um aluno.

Clique em “Gerar Plano Adaptado”.

O sistema usa IA (RAG) para ler o histórico de PDFs e atividades anteriores.

Gera automaticamente um plano pedagógico individualizado com recomendações.

🧠 Integração com Backend
Recurso	Endpoint	Descrição
📘 Atividades	POST /atividades	Cria uma nova atividade adaptada
📚 Planos	POST /planos/gerar	Gera plano personalizado com IA e RAG
📊 Relatórios	GET /atividades	Lista atividades e progresso
🧩 Upload de PDF	POST /upload (futuro)	Indexa novos documentos para IA
📦 Build de Produção

Gere a versão otimizada para deploy:

npm run build


Os arquivos finais estarão em dist/.

🔧 Tecnologias de Suporte

OpenAI GPT-4o — geração de planos e textos pedagógicos adaptados.

Supabase — banco de dados e autenticação.

Render / Railway — deploy backend e banco.

Vercel — deploy frontend.

🧩 Próximos Passos

✅ Conectar completamente o front com backend (FastAPI).

✅ Implementar armazenamento de PDFs para histórico do aluno (MinIO / Supabase).

🔜 Adicionar módulo de relatórios BI (ClickHouse).

🔜 Implementar sincronização offline-first (IndexedDB).

❤️ Agradecimentos

Criado com propósito inclusivo por Leonardo Mendes, também PCD,
para promover educação acessível e personalizada para todas as crianças.

“A tecnologia só tem sentido quando serve para incluir.”

🧱 Créditos

Interface construída com Rocket.new

Frontend: React + Vite + TailwindCSS

Backend: FastAPI + PostgreSQL + OpenAI

Licença: MIT