backend/
├── prisma/
│   ├── schema.prisma         # Schema do banco de dados
│   ├── migrations/           # Histórico de migrações
│   └── seed.ts              # Dados iniciais (opcional)
├── src/
│   ├── controllers/
│   │   ├── AuthController.js      # Login, registro
│   │   ├── ClienteController.js   # CRUD clientes
│   │   ├── ContaController.js     # CRUD contas
│   │   └── LancamentoController.js # Saque, depósito, extrato
│   ├── services/
│   │   ├── AuthService.js         # Lógica de autenticação
│   │   ├── ClienteService.js      # Regras de negócio cliente
│   │   ├── ContaService.js        # Geração número conta, validações
│   │   └── LancamentoService.js   # Validação saldo, tipos lançamento
│   ├── repositories/
│   │   ├── ClienteRepository.js   # Queries Prisma - cliente
│   │   ├── ContaRepository.js     # Queries Prisma - conta
│   │   └── LancamentoRepository.js # Queries Prisma - lançamento
│   ├── dto/                       # Data Transfer Objects
│   │   ├── ClienteDTO.js          # Validação e transformação - cliente
│   │   ├── ContaDTO.js            # Validação e transformação - conta
│   │   └── LancamentoDTO.js       # Validação e transformação - lançamento
│   ├── middleware/
│   │   ├── auth.js               # Validação JWT
│   │   ├── validation.js         # Validação de dados
│   │   └── errorHandler.js       # Tratamento de erros
│   ├── config/
│   │   ├── database.js           # Configuração Prisma Client
│   │   └── jwt.js                # Configuração JWT
│   ├── routes/
│   │   ├── auth.js               # Rotas de autenticação
│   │   ├── clientes.js           # Rotas de clientes
│   │   ├── contas.js             # Rotas de contas
│   │   └── lancamentos.js        # Rotas de lançamentos
│   └── utils/
│       ├── bcrypt.js             # Hash de senhas
│       ├── jwt.js                # Geração/validação tokens
│       └── validators.js         # Validações customizadas
├── .env                          # Variáveis de ambiente
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── index.js                      # Entrada da aplicação
