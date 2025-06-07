# Dependências de Produção - Backend

Este documento detalha todas as dependências de produção utilizadas no backend do sistema bancário.

## @prisma/client (6.8.2)

**Descrição**: Cliente gerado automaticamente pelo Prisma ORM que fornece uma API type-safe para interagir com o banco de dados.

**Problema que resolve**: 
- Elimina a necessidade de escrever SQL manualmente
- Fornece type safety completo para operações de banco
- Previne erros de runtime relacionados a queries
- Facilita migrações e mudanças de schema

**Como usar**:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Buscar todos os clientes
const clientes = await prisma.cliente.findMany()

// Criar um novo cliente
const novoCliente = await prisma.cliente.create({
  data: {
    nome: 'João Silva',
    cpf: '12345678901',
    email: 'joao@email.com'
  }
})

// Buscar cliente com contas relacionadas
const clienteComContas = await prisma.cliente.findUnique({
  where: { id: 1 },
  include: { contas: true }
})
```

## bcrypt (^6.0.0) e bcryptjs (^3.0.2)

**Descrição**: Bibliotecas para hash de senhas usando o algoritmo bcrypt, que é considerado seguro para armazenamento de senhas.

**Problema que resolve**:
- Armazenamento seguro de senhas no banco de dados
- Proteção contra ataques de força bruta
- Implementação de salt automático
- Verificação segura de senhas

**Como usar**:
```typescript
import bcrypt from 'bcrypt'

// Hash de senha ao criar usuário
const hashSenha = async (senha: string): Promise<string> => {
  const saltRounds = 12
  return await bcrypt.hash(senha, saltRounds)
}

// Verificar senha no login
const verificarSenha = async (senha: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(senha, hash)
}

// Exemplo de uso no controller
export class AuthController {
  async register(req: Request, res: Response) {
    const { email, senha } = req.body
    const senhaHash = await hashSenha(senha)
    
    const usuario = await prisma.usuario.create({
      data: { email, senha: senhaHash }
    })
    
    res.json({ message: 'Usuário criado com sucesso' })
  }
}
```

## cookie-parser (^1.4.7)

**Descrição**: Middleware para Express que analisa cookies HTTP e os disponibiliza em `req.cookies`.

**Problema que resolve**:
- Facilita o trabalho com cookies HTTP
- Permite armazenamento de tokens de autenticação
- Suporte a cookies assinados para segurança
- Simplifica o gerenciamento de sessões

**Como usar**:
```typescript
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cookieParser('secret-key'))

// Definir cookie
app.post('/login', (req, res) => {
  const token = generateJWT(user)
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  })
  res.json({ message: 'Login realizado' })
})

// Ler cookie
app.get('/profile', (req, res) => {
  const token = req.cookies.authToken
  if (!token) {
    return res.status(401).json({ error: 'Token não encontrado' })
  }
  // Verificar token...
})
```

## express (^5.1.0)

**Descrição**: Framework web minimalista e flexível para Node.js que fornece recursos robustos para aplicações web e mobile.

**Problema que resolve**:
- Criação de APIs REST de forma simples
- Roteamento de requisições HTTP
- Middleware para processamento de requisições
- Integração com diversos bancos de dados
- Tratamento de erros centralizado

**Como usar**:
```typescript
import express from 'express'
import cors from 'cors'

const app = express()

// Middlewares globais
app.use(express.json())
app.use(cors())

// Rotas
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany()
    res.json(clientes)
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.post('/api/clientes', async (req, res) => {
  try {
    const { nome, cpf, email } = req.body
    const cliente = await prisma.cliente.create({
      data: { nome, cpf, email }
    })
    res.status(201).json(cliente)
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' })
  }
})

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Algo deu errado!' })
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
```

## jsonwebtoken (^9.0.2)

**Descrição**: Implementação de JSON Web Tokens (JWT) para Node.js, usado para autenticação e autorização.

**Problema que resolve**:
- Autenticação stateless
- Transmissão segura de informações entre partes
- Autorização baseada em tokens
- Escalabilidade em aplicações distribuídas

**Como usar**:
```typescript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// Gerar token
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'sistema-bancario'
  })
}

// Verificar token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Token inválido')
  }
}

// Middleware de autenticação
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }
  
  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
}

// Uso no login
app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body
  const usuario = await prisma.usuario.findUnique({ where: { email } })
  
  if (usuario && await bcrypt.compare(senha, usuario.senha)) {
    const token = generateToken({ id: usuario.id, email: usuario.email })
    res.json({ token, usuario: { id: usuario.id, email: usuario.email } })
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' })
  }
})
```