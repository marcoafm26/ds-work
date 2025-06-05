# Documentação dos Pacotes

Este diretório contém a documentação detalhada de todos os pacotes utilizados no projeto do sistema bancário. Cada arquivo fornece informações abrangentes sobre instalação, configuração, uso e boas práticas.

## 📦 Pacotes Documentados

### Backend

#### 🗄️ [Prisma ORM](./prisma.md)

-   **Descrição**: ORM moderno para Node.js com type safety
-   **Uso**: Gerenciamento de banco de dados, migrações, queries
-   **Recursos**: Schema declarativo, cliente tipado, migrações automáticas
-   **Integração**: Core do projeto para todas as operações de banco

#### 🌐 [Express.js](./express.md)

-   **Descrição**: Framework web minimalista para Node.js
-   **Uso**: Servidor HTTP, roteamento, middlewares
-   **Recursos**: API REST, middlewares, tratamento de erros
-   **Integração**: Base da API REST do sistema bancário

#### 🔗 [MySQL2](./mysql2.md)

-   **Descrição**: Driver MySQL moderno para Node.js
-   **Uso**: Conexão com banco MySQL, pool de conexões
-   **Recursos**: Promises nativas, performance otimizada, SSL
-   **Integração**: Usado pelo Prisma para conectar ao MySQL

#### 🔄 [Nodemon](./nodemon.md)

-   **Descrição**: Ferramenta de desenvolvimento com auto-reload
-   **Uso**: Desenvolvimento local, reinicialização automática
-   **Recursos**: Monitoramento de arquivos, configuração flexível
-   **Integração**: Ambiente de desenvolvimento do projeto

## 🏗️ Arquitetura do Projeto

### Stack Tecnológico

```
┌─────────────────┐
│    Frontend     │
│  React + Vite   │
│   TypeScript    │
│   Tailwind CSS  │
└─────────────────┘
         │
         │ HTTP/REST
         │
┌─────────────────┐
│     Backend     │
│    Express.js   │
│    Node.js      │
└─────────────────┘
         │
         │ Prisma ORM
         │
┌─────────────────┐
│    Database     │
│     MySQL       │
│    (Docker)     │
└─────────────────┘
```

### Fluxo de Dados

1. **Frontend** → Requisições HTTP para API
2. **Express.js** → Roteamento e middlewares
3. **Controllers** → Validação e DTOs
4. **Services** → Regras de negócio
5. **Repositories** → Acesso a dados via Prisma
6. **Prisma** → Queries SQL otimizadas
7. **MySQL** → Persistência de dados

## 🚀 Configuração Rápida

### 1. Instalação das Dependências

```bash
# Navegar para o backend
cd backend

# Instalar dependências
pnpm install

# Configurar Prisma
pnpm prisma generate
pnpm prisma db push
```

### 2. Configuração do Ambiente

```bash
# Copiar arquivo de ambiente
cp .env.example .env

# Editar variáveis necessárias
# DATABASE_URL, JWT_SECRET, etc.
```

### 3. Iniciar Desenvolvimento

```bash
# Modo desenvolvimento com auto-reload
pnpm run dev

# Ou iniciar servidor normal
pnpm start
```

## 📋 Comandos Essenciais

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm run dev

# Gerar cliente Prisma após mudanças no schema
pnpm prisma generate

# Aplicar mudanças no banco (desenvolvimento)
pnpm prisma db push

# Visualizar dados no navegador
pnpm prisma studio
```

### Banco de Dados

```bash
# Criar nova migração
pnpm prisma migrate dev --name nome-da-migration

# Aplicar migrações em produção
pnpm prisma migrate deploy

# Reset completo do banco (CUIDADO!)
pnpm prisma migrate reset

# Sincronizar schema com banco existente
pnpm prisma db pull
```

### Testes e Qualidade

```bash
# Executar testes
pnpm test

# Testes em modo watch
pnpm test:watch

# Verificar código
pnpm run lint

# Corrigir problemas de lint
pnpm run lint:fix
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente

```bash
# .env
DATABASE_URL="mysql://user:password@localhost:3306/banco_db"
JWT_SECRET="seu-jwt-secret-super-seguro"
NODE_ENV="development"
PORT="3000"
```

### Scripts do Package.json

```json
{
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "test": "jest",
        "lint": "eslint .",
        "prisma:generate": "prisma generate",
        "prisma:studio": "prisma studio",
        "prisma:migrate": "prisma migrate dev"
    }
}
```

## 📚 Recursos de Aprendizado

### Documentação Oficial

-   [Prisma Docs](https://www.prisma.io/docs/)
-   [Express.js Guide](https://expressjs.com/)
-   [MySQL2 GitHub](https://github.com/sidorares/node-mysql2)
-   [Nodemon Docs](https://nodemon.io/)

### Tutoriais Recomendados

1. **Prisma**: Schema design, migrations, queries avançadas
2. **Express**: Middlewares, autenticação, tratamento de erros
3. **MySQL**: Otimização de queries, índices, performance
4. **Node.js**: Async/await, streams, clustering

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**

    - Verificar se MySQL está rodando
    - Conferir credenciais no `.env`
    - Testar conexão: `pnpm prisma db pull`

2. **Prisma client desatualizado**

    - Regenerar cliente: `pnpm prisma generate`
    - Verificar schema: `pnpm prisma validate`

3. **Nodemon não reinicia**

    - Verificar configuração `nodemon.json`
    - Limpar cache: `rm -rf node_modules/.cache`

4. **Porta já em uso**
    - Verificar processos: `lsof -i :3000`
    - Matar processo: `kill -9 <PID>`

### Logs e Debugging

```bash
# Logs do Prisma
DEBUG="prisma:*" pnpm run dev

# Logs detalhados do Express
DEBUG="express:*" pnpm run dev

# Debug com Chrome DevTools
pnpm run dev:debug
# Acesse: chrome://inspect
```

## 🎯 Próximos Passos

### Para Desenvolvimento

1. **Implementar autenticação JWT**

    - Middleware de autenticação
    - Rotas protegidas
    - Refresh tokens

2. **Criar testes automatizados**

    - Testes unitários (Jest)
    - Testes de integração
    - Testes E2E

3. **Implementar validações**

    - DTOs com validação
    - Middleware de validação
    - Tratamento de erros

4. **Otimizar performance**
    - Cache Redis
    - Compressão gzip
    - Rate limiting

### Para Produção

1. **Configurar CI/CD**

    - GitHub Actions
    - Deploy automatizado
    - Testes automáticos

2. **Monitoramento**

    - Logs estruturados
    - Métricas de performance
    - Alertas de erro

3. **Segurança**
    - HTTPS obrigatório
    - Validação de inputs
    - Rate limiting
    - Helmet.js

## 📞 Suporte

Para dúvidas específicas sobre cada pacote, consulte:

-   **Prisma**: [prisma.md](./prisma.md)
-   **Express**: [express.md](./express.md)
-   **MySQL2**: [mysql2.md](./mysql2.md)
-   **Nodemon**: [nodemon.md](./nodemon.md)

Cada arquivo contém exemplos práticos, configurações avançadas e troubleshooting específico.

---

**Última atualização**: Dezembro 2024
**Versão do projeto**: 1.0.0
**Ambiente**: Desenvolvimento acadêmico
