# Plano de Desenvolvimento - Sistema Bancário

## Backend

### 1. Configuração do Ambiente e Projeto

-   [ ] Configurar ambiente de desenvolvimento (Docker, MySQL)
-   [ ] Inicializar projeto Node.js com Express
-   [ ] Configurar Prisma ORM
-   [ ] Criar arquivo `.env` com variáveis de ambiente
-   [ ] Configurar `package.json` com scripts necessários

### 2. Modelo de Dados (Prisma Schema)

-   [ ] Criar `prisma/schema.prisma` com as tabelas obrigatórias:
    -   [ ] **tbCliente**: `id`, `nome`, `cpf` (único), `telefone`, `senha`
    -   [ ] **tbConta**: `id`, `numero` (único), `idCliente` (FK)
    -   [ ] **tbLancamento**: `id`, `valor` (≥0), `tipo` (ENUM: credito/debito), `idConta` (FK)
-   [ ] Gerar Prisma Client (`npx prisma generate`)
-   [ ] Executar migrações (`npx prisma migrate dev`)

### 3. Arquitetura em Camadas

#### 3.1 Data Transfer Objects (DTOs)

-   [ ] Criar `src/dto/ClienteDTO.js`:
    -   [ ] Campos: `nome`, `cpf`, `telefone`, `senha`
    -   [ ] Métodos de validação
    -   [ ] Método `toPrismaData()`
-   [ ] Criar `src/dto/ContaDTO.js`:
    -   [ ] Campos: `numero`, `cpf` (ocultar dados sensíveis)
    -   [ ] Validações específicas
-   [ ] Criar `src/dto/LancamentoDTO.js`:
    -   [ ] Campos: `valor`, `tipo`
    -   [ ] Validação de valor positivo

#### 3.2 Camada Repository

-   [ ] Criar `src/repositories/ClienteRepository.js`:
    -   [ ] Métodos CRUD com Prisma Client
    -   [ ] Busca por CPF
    -   [ ] Validação de unicidade
-   [ ] Criar `src/repositories/ContaRepository.js`:
    -   [ ] Operações de conta
    -   [ ] Busca por cliente
    -   [ ] Geração de número único
-   [ ] Criar `src/repositories/LancamentoRepository.js`:
    -   [ ] Registro de lançamentos
    -   [ ] Consulta de extrato

#### 3.3 Camada Service (Regras de Negócio)

-   [ ] Criar `src/services/ClienteService.js`:
    -   [ ] Validação de CPF único
    -   [ ] Hash de senha
    -   [ ] Regras de cadastro
-   [ ] Criar `src/services/ContaService.js`:
    -   [ ] Geração automática de número da conta (padrão AA-999999)
    -   [ ] Validação de unicidade do número
-   [ ] Criar `src/services/LancamentoService.js`:
    -   [ ] Processamento de débito/crédito
    -   [ ] Regras de lançamento
-   [ ] Criar `src/services/AuthService.js`:
    -   [ ] Autenticação com JWT
    -   [ ] Validação de credenciais
    -   [ ] Geração de tokens

#### 3.4 Camada Controller (API REST)

-   [ ] Criar `src/controllers/AuthController.js`:
    -   [ ] `POST /auth/login` - Autenticação
    -   [ ] `POST /auth/register` - Cadastro (público)
-   [ ] Criar `src/controllers/ClienteController.js`:
    -   [ ] `GET /clientes` - Listar clientes
    -   [ ] `GET /clientes/{id}` - Buscar por ID
    -   [ ] `POST /clientes` - Cadastrar cliente (público)
    -   [ ] `PUT /clientes/{id}` - Atualizar cliente
    -   [ ] `DELETE /clientes/{id}` - Remover cliente
    -   [ ] `GET /clientes/{id}/contas` - Contas do cliente
-   [ ] Criar `src/controllers/ContaController.js`:
    -   [ ] Endpoints para operações de conta
    -   [ ] Validação de propriedade da conta
-   [ ] Criar `src/controllers/LancamentoController.js`:
    -   [ ] Endpoints para saque, depósito e extrato
    -   [ ] Validação de regras de negócio

### 4. Segurança e Middlewares

-   [ ] Criar `src/middleware/auth.js`:
    -   [ ] Validação de JWT
    -   [ ] Proteção de rotas
-   [ ] Criar `src/middleware/validation.js`:
    -   [ ] Validação de dados de entrada
-   [ ] Criar `src/middleware/errorHandler.js`:
    -   [ ] Tratamento centralizado de erros
-   [ ] Implementar controle de acesso:
    -   [ ] Rotas públicas: cadastro e autenticação
    -   [ ] Rotas protegidas: todas as demais

### 5. Configuração e Rotas

-   [ ] Criar `src/config/database.js` - Configuração Prisma Client
-   [ ] Criar `src/config/jwt.js` - Configuração JWT
-   [ ] Criar arquivos de rotas em `src/routes/`:
    -   [ ] `auth.js` - Rotas de autenticação
    -   [ ] `clientes.js` - Rotas de clientes
    -   [ ] `contas.js` - Rotas de contas
    -   [ ] `lancamentos.js` - Rotas de lançamentos
-   [ ] Configurar `index.js` como entrada da aplicação

### 6. Utilitários

-   [ ] Criar `src/utils/bcrypt.js` - Hash de senhas
-   [ ] Criar `src/utils/jwt.js` - Geração/validação de tokens
-   [ ] Criar `src/utils/validators.js` - Validações customizadas

### 🏗️ **FASE 2: Camada de DTOs (Data Transfer Objects)**

#### 2.1 ClienteDTO

-   [ ] **Criar CreateClienteDTO**

    -   Arquivo: `/backend/src/dto/ClienteDTO.js`
    -   Campos:
        ```javascript
        constructor(data) {
          this.nome = data.nome;           // string, obrigatório, min 2 chars
          this.cpf = data.cpf;             // string, obrigatório, 11 dígitos
          this.telefone = data.telefone;   // string, opcional
          this.senha = data.senha;         // string, obrigatório, min 6 chars
        }
        ```
    -   Métodos: `validate()`, `isValidCPF()`, `toPrismaData()`

-   [ ] **Criar UpdateClienteDTO**
    -   Campos: mesmos do Create, mas todos opcionais
    -   Métodos: `validate()`, `toPrismaData()`

#### 2.2 ContaDTO

-   [ ] **Criar CreateContaDTO**
    -   Arquivo: `/backend/src/dto/ContaDTO.js`
    -   Campos:
        ```javascript
        constructor(data) {
          this.numero = data.numero;           // string, obrigatório
          this.idCliente = data.idCliente;     // number, obrigatório
        }
        ```
    -   Métodos: `validate()`, `toPrismaData()`

#### 2.3 LancamentoDTO

-   [ ] **Criar CreateLancamentoDTO**
    -   Arquivo: `/backend/src/dto/LancamentoDTO.js`
    -   Campos:
        ```javascript
        constructor(data) {
          this.idConta = data.idConta;         // number, obrigatório
          this.tipo = data.tipo;               // enum: 'credito' | 'debito'
          this.valor = data.valor;             // number, obrigatório, > 0
        }
        ```
    -   Métodos: `validate()`, `toPrismaData()`

### 🗄️ **FASE 3: Camada de Repositories**

#### 3.1 ClienteRepository

-   [ ] **Criar ClienteRepository**
    -   Arquivo: `/backend/src/repositories/ClienteRepository.js`
    -   Propriedades:
        ```javascript
        import { prisma } from '../config/database.js';
        class ClienteRepository {
            // Métodos CRUD
        }
        ```
    -   Métodos:
        -   `async create(data)` - Criar cliente
        -   `async findById(id)` - Buscar por ID com relacionamentos
        -   `async findByCpf(cpf)` - Buscar por CPF
        -   `async findAll(filters = {})` - Listar com filtros
        -   `async update(id, data)` - Atualizar cliente
        -   `async delete(id)` - Deletar cliente
        -   `async getStats()` - Estatísticas de clientes

#### 3.2 ContaRepository

-   [ ] **Criar ContaRepository**
    -   Arquivo: `/backend/src/repositories/ContaRepository.js`
    -   Métodos:
        -   `async create(data)` - Criar conta
        -   `async findById(id)` - Buscar conta com relacionamentos
        -   `async findByClienteId(clienteId)` - Contas do cliente
        -   `async findByNumero(numero)` - Buscar por número da conta
        -   `async generateNumero()` - Gerar número único da conta

#### 3.3 LancamentoRepository

-   [ ] **Criar LancamentoRepository**
    -   Arquivo: `/backend/src/repositories/LancamentoRepository.js`
    -   Métodos:
        -   `async create(data)` - Criar lançamento
        -   `async findByContaId(contaId, limit = 50)` - Lançamentos da conta

### 🔧 **FASE 4: Camada de Services (Regras de Negócio)**

#### 4.1 ClienteService

-   [ ] **Criar ClienteService**
    -   Arquivo: `/backend/src/services/ClienteService.js`
    -   Propriedades:
        ```javascript
        constructor() {
          this.clienteRepository = new ClienteRepository();
        }
        ```
    -   Métodos:
        -   `async criarCliente(dadosCliente)` - Validar e criar
        -   `async buscarCliente(id)` - Buscar com formatação
        -   `async atualizarCliente(id, dados)` - Validar e atualizar
        -   `async listarClientes(filtros)` - Listar com paginação
        -   `async deletarCliente(id)` - Validar e deletar
        -   `formatClienteResponse(cliente)` - Formatar resposta

#### 4.2 ContaService

-   [ ] **Criar ContaService**
    -   Arquivo: `/backend/src/services/ContaService.js`
    -   Métodos:
        -   `async criarConta(dadosConta)` - Validar cliente e criar
        -   `async buscarConta(id)` - Buscar com validações
        -   `async listarContasCliente(clienteId)` - Contas do cliente
        -   `async gerarNumeroConta()` - Gerar número único

#### 4.3 LancamentoService

-   [ ] **Criar LancamentoService**
    -   Arquivo: `/backend/src/services/LancamentoService.js`
    -   Métodos:
        -   `async realizarDeposito(contaId, valor)` - Depósito
        -   `async realizarSaque(contaId, valor)` - Saque
        -   `async obterExtrato(contaId)` - Extrato

### 🎮 **FASE 5: Camada de Controllers**

#### 5.1 ClienteController

-   [ ] **Criar ClienteController**
    -   Arquivo: `/backend/src/controllers/ClienteController.js`
    -   Propriedades:
        ```javascript
        constructor() {
          this.clienteService = new ClienteService();
        }
        ```
    -   Métodos:
        -   `async criar(req, res)` - POST /clientes
        -   `async buscarPorId(req, res)` - GET /clientes/:id
        -   `async listar(req, res)` - GET /clientes
        -   `async atualizar(req, res)` - PUT /clientes/:id
        -   `async deletar(req, res)` - DELETE /clientes/:id

#### 5.2 ContaController

-   [ ] **Criar ContaController**
    -   Arquivo: `/backend/src/controllers/ContaController.js`
    -   Métodos:
        -   `async criar(req, res)` - POST /contas
        -   `async buscarPorId(req, res)` - GET /contas/:id
        -   `async listarPorCliente(req, res)` - GET /clientes/:id/contas
        -   `async obterSaldo(req, res)` - GET /contas/:id/saldo

#### 5.3 LancamentoController

-   [ ] **Criar LancamentoController**
    -   Arquivo: `/backend/src/controllers/LancamentoController.js`
    -   Métodos:
        -   `async depositar(req, res)` - POST /contas/:id/deposito
        -   `async sacar(req, res)` - POST /contas/:id/saque
        -   `async obterExtrato(req, res)` - GET /contas/:id/extrato
        -   `async listarLancamentos(req, res)` - GET /contas/:id/lancamentos

### 🛣️ **FASE 6: Camada de Routes**

#### 6.1 Rotas de Clientes

-   [ ] **Criar rotas de clientes**
    -   Arquivo: `/backend/src/routes/clientes.js`
    -   Rotas:
        ```javascript
        router.post('/', clienteController.criar);
        router.get('/', clienteController.listar);
        router.get('/:id', clienteController.buscarPorId);
        router.put('/:id', clienteController.atualizar);
        router.delete('/:id', clienteController.deletar);
        ```

#### 6.2 Rotas de Contas

-   [ ] **Criar rotas de contas**
    -   Arquivo: `/backend/src/routes/contas.js`
    -   Rotas:
        ```javascript
        router.post('/', contaController.criar);
        router.get('/:id', contaController.buscarPorId);
        router.get('/:id/extrato', lancamentoController.obterExtrato);
        ```

#### 6.3 Rotas de Lançamentos

-   [ ] **Criar rotas de lançamentos**
    -   Arquivo: `/backend/src/routes/lancamentos.js`
    -   Rotas:
        ```javascript
        router.post('/deposito', lancamentoController.depositar);
        router.post('/saque', lancamentoController.sacar);
        ```

### 🛡️ **FASE 7: Middlewares e Utilitários**

#### 7.1 Middleware de Validação

-   [ ] **Criar middleware de validação**
    -   Arquivo: `/backend/src/middleware/validation.js`
    -   Funções:
        -   `validateClienteData(req, res, next)` - Validar dados do cliente
        -   `validateContaData(req, res, next)` - Validar dados da conta
        -   `validateLancamentoData(req, res, next)` - Validar lançamento

#### 7.2 Middleware de Tratamento de Erros

-   [ ] **Criar middleware de erro**
    -   Arquivo: `/backend/src/middleware/errorHandler.js`
    -   Função: `errorHandler(err, req, res, next)`
    -   Tratar: Prisma errors, Validation errors, Generic errors

#### 7.3 Utilitários

-   [ ] **Criar utilitários**
    -   Arquivo: `/backend/src/utils/validators.js`
    -   Funções:
        -   `isValidCPF(cpf)` - Validar CPF
        -   `formatCurrency(value)` - Formatar moeda
        -   `formatCPF(cpf)` - Formatar CPF

### 🔗 **FASE 8: Integração e Configuração Final**

#### 8.1 Configuração do Servidor Principal

-   [ ] **Atualizar index.js**
    -   Arquivo: `/backend/index.js`
    -   Configurações:
        ```javascript
        import express from 'express';
        import { connectDatabase } from './src/config/database.js';
        import clientesRoutes from './src/routes/clientes.js';
        import contasRoutes from './src/routes/contas.js';
        import lancamentosRoutes from './src/routes/lancamentos.js';
        import { errorHandler } from './src/middleware/errorHandler.js';
        ```
    -   Middlewares: CORS, JSON parser, Routes, Error handler

#### 8.2 Testes de Integração

-   [ ] **Criar testes básicos**
    -   Testar criação de cliente
    -   Testar criação de conta
    -   Testar operações de depósito/saque
    -   Testar extrato

### 🎨 **FASE 9: Preparação para Frontend**

#### 9.1 Documentação da API

-   [ ] **Documentar endpoints**
    -   Criar arquivo: `/backend/API.md`
    -   Documentar todos os endpoints
    -   Exemplos de request/response
    -   Códigos de erro

#### 9.2 CORS e Configurações

-   [ ] **Configurar CORS para frontend**
    -   Permitir origem do frontend (localhost:3000)
    -   Configurar headers permitidos
    -   Configurar métodos permitidos

---

## 🖥️ **FASE 10: Desenvolvimento Frontend (Próxima Etapa)**

### 10.1 Configuração Inicial

-   [ ] **Criar projeto React com Vite**
    -   `npm create vite@latest frontend -- --template react-ts`
    -   Instalar Tailwind CSS
    -   Configurar estrutura de pastas

### 10.2 Componentes Base

-   [ ] **Criar componentes de layout**
    -   Header, Sidebar, Footer
    -   Layout principal
    -   Componentes de formulário

### 10.3 Páginas Principais

-   [ ] **Criar páginas do sistema**
    -   Dashboard
    -   Gestão de Clientes
    -   Gestão de Contas
    -   Operações Bancárias
    -   Extratos e Relatórios

### 10.4 Integração com API

-   [ ] **Configurar cliente HTTP**
    -   Axios ou Fetch API
    -   Interceptors para tratamento de erro
    -   Configuração de base URL

---

## 📝 **Notas Importantes**

### Ordem de Desenvolvimento Recomendada:

1. **Bottom-up**: DTOs → Repositories → Services → Controllers → Routes
2. **Testar cada camada** antes de prosseguir
3. **Validar com Prisma Studio** após cada implementação
4. **Documentar endpoints** conforme implementa

### Comandos Úteis Durante o Desenvolvimento:

```bash
# Gerar cliente Prisma após mudanças no schema
pnpm prisma generate

# Visualizar dados no Prisma Studio
pnpm prisma studio

# Executar em modo desenvolvimento
pnpm run dev

# Criar nova migração
pnpm run migration:create

# Aplicar migrações
pnpm run migrate
```

### Pontos de Atenção:

-   ✅ Sempre validar dados antes de enviar ao Prisma
-   ✅ Usar transações para operações que afetam múltiplas tabelas
-   ✅ Implementar logs para debugging
-   ✅ Tratar erros específicos do Prisma
-   ✅ Manter consistência nos nomes e padrões
-   ✅ Testar cenários de erro (saldo insuficiente, CPF duplicado, etc.)
