# Tarefas Domésticas

App de gerenciamento de tarefas domésticas com sistema de repetição e checklist diário.

## Configuração de Autenticação

Este app usa NextAuth v5 com login exclusivo via GitHub para o email `robertotcestari@gmail.com`.

### 1. Criar GitHub OAuth App

1. Acesse: https://github.com/settings/applications/new
2. Preencha:
   - **Application name**: Tarefas Domésticas
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
3. Clique em "Register application"
4. Copie o **Client ID** e **Client Secret**

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite `.env.local` e preencha:
   ```env
   NEXTAUTH_SECRET=sua-chave-secreta-aleatoria
   NEXTAUTH_URL=http://localhost:3000
   GITHUB_CLIENT_ID=seu-client-id-do-github
   GITHUB_CLIENT_SECRET=seu-client-secret-do-github
   ```

### 3. Gerar Secret Key

```bash
openssl rand -base64 32
```

## Configuração do Banco de Dados

### Instalar MySQL (se necessário)

```bash
# No macOS com Homebrew
brew install mysql
brew services start mysql
```

### Criar o banco de dados

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS tarefas_domesticas;"
```

### Executar migrações

```bash
# Gerar o cliente Prisma
bunx prisma generate

# Executar migrações
bunx prisma migrate dev --name init
```

## Desenvolvimento

```bash
# Instalar dependências
bun install

# Executar em modo desenvolvimento
bun dev
```

Acesse: http://localhost:3000

## Estrutura do Projeto

- `/app/_types/task-types.ts` - Tipos TypeScript para tarefas e usuários
- `/auth.ts` - Configuração do NextAuth
- `/middleware.ts` - Proteção de rotas
- `/app/auth/` - Páginas de autenticação
- `/app/api/auth/` - Rotas da API do NextAuth
