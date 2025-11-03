# Product Management App

Uma aplicação moderna de gerenciamento de produtos desenvolvida com Vue 3, TypeScript e PrimeVue. Oferece uma interface intuitiva para administrar produtos com diferentes níveis de acesso (admin e tenant).

## 🚀 Tecnologias Utilizadas

- **Vue 3** - Framework principal
- **TypeScript** - Tipagem estática
- **PrimeVue** - Biblioteca de componentes UI
- **Vite** - Build tool e dev server
- **Pinia** - Gerenciamento de estado
- **Vue Query** - Gerenciamento de estado do servidor
- **Vue Router** - Roteamento
- **JSON Server** - API REST simulada
- **PrimeFlex** - Sistema de grid e utilitários CSS

## 📋 Funcionalidades

### 🔐 Sistema de Autenticação

- Login com diferentes níveis de acesso (Admin e Tenant)
- Proteção de rotas baseada em roles
- Logout seguro

### 📊 Gerenciamento de Produtos

- **Visualização em Tabela**: Lista paginada com ordenação e filtros
- **Visualização em Prateleira**: Interface drag-and-drop para organizar produtos
- **CRUD Completo**: Criar, editar, excluir e alterar status de produtos
- **Status Management**: Ativar/desativar produtos
- **Validação de Formulários**: Validação em tempo real

### 👥 Sistema de Permissões

- **Admin**: Acesso completo a todos os produtos e funcionalidades
- **Tenant**: Acesso limitado aos próprios produtos

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── inputs/          # Componentes de input customizados
│   ├── products/        # Componentes específicos de produtos
│   └── ui/              # Componentes de UI reutilizáveis
├── composables/         # Composables Vue (hooks)
├── services/            # Serviços de API
├── stores/              # Stores Pinia
├── types/               # Definições TypeScript
├── views/               # Páginas/rotas
└── router/              # Configuração de rotas
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 22.20.0
- npm ou yarn

### Instalação e Execução

1. **Instalar dependências:**

```bash
npm install
```

2. **Iniciar a API (JSON Server):**

```bash
npm run api
```

A API estará disponível em: `http://localhost:3001`

3. **Iniciar o modo de desenvolvimento:**

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

### Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run api          # JSON Server API

# Build e produção
npm run build        # Build para produção
npm run preview      # Preview do build

# Qualidade de código
npm run type-check   # Verificação de tipos TypeScript
npm run lint         # ESLint com auto-correção
npm run format       # Formatação com Prettier
```

## 👤 Usuários de Teste

### Admin (Acesso Completo)

- **Email:** admin@test.com
- **Senha:** 123

### Tenant (Acesso Limitado)

- **Email:** tenant@test.com
- **Senha:** 123

## 🎨 Design System

A aplicação utiliza um sistema de design consistente com:

- **Tema Aura** do PrimeVue (modo claro)
- **Design System** com variáveis CSS customizadas
- **Componentes** reutilizáveis e acessíveis
- **Responsividade** para mobile e desktop

## 🔧 Configuração da API

### Endpoints Disponíveis

- `GET /admin_products` - Produtos para administradores
- `GET /tenant_products` - Produtos para tenants
- `POST /login` - Autenticação de usuários
- Operações CRUD completas para produtos

### Estrutura de Dados

```typescript
interface Product {
  id: number | string
  name: string
  price: number
  image: string
  description: string
  status: 'activated' | 'disabled'
  role?: 'admin' | 'tenant'
}
```

## 🛠️ Desenvolvimento

### Adicionando Novos Componentes

1. Crie o componente na pasta apropriada
2. Use TypeScript para tipagem
3. Importe e registre componentes globais quando necessário
4. Mantenha a consistência com o design system

### Customização do Tema

Edite `src/assets/css/variables.css` para customizar cores, espaçamentos e tipografia.

## 📦 Scripts de Build

- `npm run build` - Build otimizado para produção
- `npm run type-check` - Verificação de tipos TypeScript
- `npm run lint` - Análise e correção de código

## 🔍 Debugging

- **Vue DevTools** - Disponível no navegador
- **TypeScript** - Verificação de tipos em tempo de desenvolvimento
- **ESLint** - Análise estática de código

## 📄 Licença

Este projeto é para fins educacionais e de demonstração.
