# Dependências de Desenvolvimento - Backend

Este documento detalha todas as dependências de desenvolvimento utilizadas no backend do sistema bancário.

## @types/* (Vários)

**Descrição**: Definições de tipos TypeScript para bibliotecas JavaScript que não possuem tipos nativos.

**Problema que resolve**:
- Fornece type safety para bibliotecas JavaScript
- Melhora a experiência de desenvolvimento com IntelliSense
- Previne erros de tipo em tempo de compilação
- Facilita refatoração de código

**Como usar**:
```typescript
// Com @types/express instalado, você tem tipos completos
import express, { Request, Response, NextFunction } from 'express'

const app = express()

// TypeScript conhece os tipos de req, res e next
app.get('/api/test', (req: Request, res: Response, next: NextFunction) => {
  // IntelliSense completo disponível
  res.json({ message: 'Hello World' })
})
```

## jest (^29.7.0) e ts-jest (^29.3.4)

**Descrição**: Framework de testes JavaScript com foco em simplicidade, com suporte para TypeScript.

**Problema que resolve**:
- Testes unitários e de integração
- Mocking de dependências
- Coverage de código
- Testes assíncronos
- Snapshot testing

**Como usar**:
```typescript
// cliente.service.test.ts
import { ClienteService } from '../src/service/ClienteService'
import { PrismaClient } from '@prisma/client'

// Mock do Prisma
jest.mock('@prisma/client')
const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>

describe('ClienteService', () => {
  let clienteService: ClienteService
  
  beforeEach(() => {
    clienteService = new ClienteService(mockPrisma)
  })
  
  describe('create', () => {
    it('deve criar um cliente com dados válidos', async () => {
      const clienteData = {
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com'
      }
      
      const clienteEsperado = { id: 1, ...clienteData }
      mockPrisma.cliente.create.mockResolvedValue(clienteEsperado)
      
      const resultado = await clienteService.create(clienteData)
      
      expect(resultado).toEqual(clienteEsperado)
      expect(mockPrisma.cliente.create).toHaveBeenCalledWith({
        data: clienteData
      })
    })
    
    it('deve lançar erro para CPF duplicado', async () => {
      const clienteData = {
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com'
      }
      
      mockPrisma.cliente.create.mockRejectedValue(
        new Error('CPF já cadastrado')
      )
      
      await expect(clienteService.create(clienteData))
        .rejects.toThrow('CPF já cadastrado')
    })
  })
})
```

## nodemon (^3.1.10)

**Descrição**: Utilitário que monitora mudanças nos arquivos e reinicia automaticamente a aplicação Node.js.

**Problema que resolve**:
- Desenvolvimento mais eficiente
- Reinicialização automática durante desenvolvimento
- Monitoramento de arquivos específicos
- Configuração flexível de watching

**Como usar**:
```json
// nodemon.json
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["src/**/*.test.ts"],
  "exec": "tsx src/index.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
```

## prisma (^6.9.0)

**Descrição**: CLI e ferramentas de desenvolvimento do Prisma ORM.

**Problema que resolve**:
- Geração de migrações de banco de dados
- Sincronização de schema
- Interface visual para banco (Prisma Studio)
- Geração de cliente tipado

**Como usar**:
```bash
# Gerar migração
prisma migrate dev --name add-user-table

# Aplicar migrações em produção
prisma migrate deploy

# Abrir Prisma Studio
prisma studio

# Gerar cliente
prisma generate
```

## tsx (^4.19.4)

**Descrição**: Executor TypeScript extremamente rápido baseado em esbuild.

**Problema que resolve**:
- Execução direta de arquivos TypeScript
- Compilação muito rápida
- Watch mode para desenvolvimento
- Suporte a ESM e CommonJS

**Como usar**:
```bash
# Executar arquivo TypeScript
tsx src/index.ts

# Watch mode
tsx watch src/index.ts

# Com debugging
tsx --inspect src/index.ts
```

## typescript (^5.8.3)

**Descrição**: Superset do JavaScript que adiciona tipagem estática.

**Problema que resolve**:
- Type safety em tempo de compilação
- Melhor IntelliSense e refatoração
- Detecção precoce de erros
- Código mais maintível e documentado

**Como usar**:
```typescript
// types/index.ts
export interface Cliente {
  id: number
  nome: string
  cpf: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateClienteDTO {
  nome: string
  cpf: string
  email: string
}

// service/ClienteService.ts
import { Cliente, CreateClienteDTO } from '../types'
import { PrismaClient } from '@prisma/client'

export class ClienteService {
  constructor(private prisma: PrismaClient) {}
  
  async create(data: CreateClienteDTO): Promise<Cliente> {
    return await this.prisma.cliente.create({ data })
  }
  
  async findById(id: number): Promise<Cliente | null> {
    return await this.prisma.cliente.findUnique({ where: { id } })
  }
}
```

## ts-node (^10.9.2) e ts-node-dev (^2.0.0)

**Descrição**: Executores TypeScript para Node.js que compilam e executam arquivos .ts diretamente.

**Problema que resolve**:
- Execução direta de TypeScript sem compilação prévia
- Desenvolvimento mais rápido
- Suporte a debugging
- Integração com ferramentas de desenvolvimento

**Como usar**:
```bash
# Executar com ts-node
ts-node src/index.ts

# Executar com ts-node-dev (com watch)
ts-node-dev --respawn src/index.ts

# Com debugging
ts-node --inspect src/index.ts
```

## Configuração do Jest

```typescript
// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
}

export default config
```

## Scripts de Desenvolvimento

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "prisma:generate": "prisma generate",
    "prisma:studio": "prisma studio",
    "prisma:migrate": "prisma migrate dev"
  }
}
```