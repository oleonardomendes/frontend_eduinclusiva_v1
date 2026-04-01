# CLAUDE.md — EduInclusiva Frontend

## Visão Geral
Frontend da plataforma EduInclusiva — interface para professores, coordenadoras, secretárias e famílias
acompanharem alunos com necessidades educacionais especiais.

---

## Stack

- **Framework:** React 18 + Vite
- **State:** Redux Toolkit
- **Roteamento:** React Router v6
- **Estilo:** TailwindCSS
- **Animações:** Framer Motion
- **Hospedagem:** Vercel

---

## Estrutura de Diretórios

```
frontend_eduinclusiva_v1/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── StudentForm.jsx
│   │       ├── StudentCard.jsx
│   │       └── Modal.jsx          # ⚠️ case-sensitive: Modal.jsx (M maiúsculo)
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   ├── store/                     # Redux slices
│   └── App.jsx
├── vercel.json
├── vite.config.js
└── .env
```

---

## Variáveis de Ambiente

```env
# .env (local)
VITE_API_BASE_URL=http://localhost:8000

# Vercel (produção) — configurar no dashboard
VITE_API_BASE_URL=https://seu-backend.onrender.com
```

> ⚠️ Toda variável exposta ao browser DEVE começar com `VITE_`

---

## Configuração Vercel (SPA Routing)

O `vercel.json` deve ter o rewrite para SPA funcionar:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Sem isso, rotas diretas (ex: `/dashboard`) retornam 404 na Vercel.

---

## Mapeamento de Roles

O backend retorna roles em português; o frontend mapeia via `roleMap` no `LoginForm`:

```javascript
const roleMap = {
  professor:    'teacher',
  secretaria:   'secretary',
  coordenadora: 'coordinator',
  familia:      'parent',
};
```

Sempre usar os roles do **frontend** (`teacher`, `secretary`, etc.) nos componentes e guards de rota.

---

## Autenticação

- Hook centralizado: `src/hooks/useAuth.js`
- Token JWT armazenado no Redux store (não em localStorage diretamente)
- Guards de rota baseados no role do usuário

---

## Componentes Importantes

### StudentCard
> ⚠️ BUG CONHECIDO: O modal "Nova Atividade" (`DialogForm`) abre automaticamente
> no carregamento do dashboard do professor. A causa suspeita está neste componente.
> Investigar estado inicial e qualquer `useEffect` que possa acionar o modal.

### Modal.jsx
- Nome do arquivo é `Modal.jsx` com **M maiúsculo** — crítico no Linux/Vercel (case-sensitive)
- Erro já ocorreu antes com `modal.jsx` causando falha no build do Rollup

### StudentForm.jsx
- Localizado em `src/components/ui/StudentForm.jsx`
- Formulário de criação/edição de aluno

---

## Padrões de Código

- Componentes funcionais com hooks (sem class components)
- Estado global no Redux; estado local com `useState`
- Animações com Framer Motion nos componentes de página
- Classes Tailwind diretamente no JSX — sem CSS modules
- Nomes de arquivos de componentes: **PascalCase** (`StudentCard.jsx`)
- Nomes de hooks: **camelCase** com prefixo `use` (`useAuth.js`)

---

## Comandos

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## Erros Comuns Já Resolvidos

| Erro | Causa | Solução |
|---|---|---|
| Build falha no Rollup | `modal.jsx` com m minúsculo | Renomear para `Modal.jsx` |
| 404 em rotas diretas | Sem rewrite no Vercel | Adicionar `vercel.json` |
| CORS bloqueado | Origin não reconhecida | Configurar `ALLOW_ORIGIN_REGEX` no backend |
| API retorna 422 | `VITE_API_BASE_URL` ausente na Vercel | Adicionar nas env vars do dashboard |
