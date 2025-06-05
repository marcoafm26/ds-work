# Express.js

## O que é o Express.js?

O Express.js é um framework web minimalista e flexível para Node.js que fornece um conjunto robusto de recursos para aplicações web e mobile. É amplamente utilizado para criar APIs REST e aplicações web.

## Recursos Principais

### 1. **Roteamento Simples**

-   Sistema de rotas intuitivo
-   Suporte a middlewares
-   Parâmetros de rota dinâmicos
-   Agrupamento de rotas

### 2. **Middlewares**

-   Funções que executam durante o ciclo de requisição-resposta
-   Controle de fluxo da aplicação
-   Reutilização de código
-   Tratamento de erros centralizado

### 3. **Performance**

-   Framework leve e rápido
-   Baixo overhead
-   Suporte a clustering
-   Otimizado para alta concorrência

## Instalação

```bash
# Instalação básica
pnpm add express

# Para desenvolvimento (auto-reload)
pnpm add -D nodemon
```

## Configuração Básica

### 1. Servidor Básico

```javascript
// index.js
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota básica
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
```

### 2. Estrutura de Rotas

```javascript
// routes/clientes.js
import express from 'express';
const router = express.Router();

// GET /api/clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await clienteService.findAll();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/clientes/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await clienteService.findById(parseInt(id));

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/clientes
router.post('/', async (req, res) => {
    try {
        const clienteDTO = new CreateClienteDTO(req.body);
        const errors = clienteDTO.validate();

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const cliente = await clienteService.create(clienteDTO);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/clientes/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const clienteDTO = new UpdateClienteDTO(req.body);
        const errors = clienteDTO.validate();

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const cliente = await clienteService.update(parseInt(id), clienteDTO);
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/clientes/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await clienteService.delete(parseInt(id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
```

### 3. Middlewares Personalizados

```javascript
// middlewares/auth.js
export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// middlewares/validation.js
export const validateDTO = (DTOClass) => {
    return (req, res, next) => {
        try {
            const dto = new DTOClass(req.body);
            const errors = dto.validate();

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            req.validatedData = dto;
            next();
        } catch (error) {
            res.status(400).json({ error: 'Dados inválidos' });
        }
    };
};

// middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
};
```

### 4. Configuração Completa do Servidor

```javascript
// index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Importar rotas
import clientesRoutes from './routes/clientes.js';
import contasRoutes from './routes/contas.js';
import lancamentosRoutes from './routes/lancamentos.js';
import authRoutes from './routes/auth.js';

// Importar middlewares
import { errorHandler } from './middlewares/errorHandler.js';
import { authMiddleware } from './middlewares/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança
app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: 'Muitas tentativas, tente novamente em 15 minutos'
});
app.use(limiter);

// Parsing de dados
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas públicas
app.use('/api/auth', authRoutes);

// Middleware de autenticação para rotas protegidas
app.use('/api', authMiddleware);

// Rotas protegidas
app.use('/api/clientes', clientesRoutes);
app.use('/api/contas', contasRoutes);
app.use('/api/lancamentos', lancamentosRoutes);

// Rota de health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Rota 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM recebido, encerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT recebido, encerrando servidor...');
    process.exit(0);
});
```

## Integração com o Projeto

### 1. **Arquitetura em Camadas**

```javascript
// controllers/ClienteController.js
export class ClienteController {
    constructor(clienteService) {
        this.clienteService = clienteService;
    }

    async create(req, res) {
        try {
            const cliente = await this.clienteService.create(req.validatedData);
            res.status(201).json(cliente);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const result = await this.clienteService.findAll({
                page: parseInt(page),
                limit: parseInt(limit),
                search
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
```

### 2. **Tratamento de Erros Específicos**

```javascript
// utils/ApiError.js
export class ApiError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

// middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    let { statusCode = 500, message } = err;

    if (err.name === 'PrismaClientKnownRequestError') {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = 'Registro já existe';
        } else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Registro não encontrado';
        }
    }

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
```

### 3. **Validação de Dados**

```javascript
// middlewares/validation.js
export const validateClienteCreation = (req, res, next) => {
    const { nome, cpf, email, telefone } = req.body;
    const errors = [];

    if (!nome || nome.length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!cpf || !/^\d{11}$/.test(cpf)) {
        errors.push('CPF deve ter 11 dígitos');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email inválido');
    }

    if (!telefone || !/^\d{10,11}$/.test(telefone)) {
        errors.push('Telefone deve ter 10 ou 11 dígitos');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};
```

## Comandos Úteis

### Scripts do package.json

```json
{
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "test": "jest",
        "test:watch": "jest --watch",
        "lint": "eslint .",
        "lint:fix": "eslint . --fix"
    }
}
```

### Comandos de desenvolvimento

```bash
# Iniciar em modo desenvolvimento
pnpm run dev

# Iniciar em produção
pnpm start

# Executar testes
pnpm test

# Verificar sintaxe
pnpm run lint
```

## Boas Práticas

### 1. **Estrutura de Projeto**

```
backend/
├── controllers/
├── services/
├── repositories/
├── middlewares/
├── routes/
├── dto/
├── utils/
├── config/
└── index.js
```

### 2. **Segurança**

-   Use HTTPS em produção
-   Implemente rate limiting
-   Valide todos os inputs
-   Use middlewares de segurança (helmet, cors)
-   Não exponha informações sensíveis

### 3. **Performance**

-   Use compressão gzip
-   Implemente cache quando apropriado
-   Otimize consultas ao banco
-   Use clustering em produção

### 4. **Monitoramento**

-   Implemente logs estruturados
-   Use health checks
-   Monitore métricas de performance
-   Configure alertas para erros

## Troubleshooting

### Problemas Comuns

1. **Porta já em uso**

    ```bash
    # Verificar processo na porta
    lsof -i :3000
    # Matar processo
    kill -9 <PID>
    ```

2. **CORS errors**

    ```javascript
    app.use(
        cors({
            origin: ['http://localhost:3000', 'http://localhost:5173'],
            credentials: true
        })
    );
    ```

3. **Request timeout**

    ```javascript
    app.use((req, res, next) => {
        req.setTimeout(30000); // 30 segundos
        next();
    });
    ```

4. **Memory leaks**
    ```javascript
    // Monitorar uso de memória
    setInterval(() => {
        const used = process.memoryUsage();
        console.log('Memory usage:', used);
    }, 60000);
    ```

## Vantagens para o Projeto

1. **Simplicidade**: API minimalista e fácil de entender
2. **Flexibilidade**: Permite diferentes arquiteturas
3. **Ecosystem**: Grande quantidade de middlewares disponíveis
4. **Performance**: Excelente para APIs REST
5. **Comunidade**: Amplo suporte e documentação
6. **Escalabilidade**: Suporte a clustering e load balancing
