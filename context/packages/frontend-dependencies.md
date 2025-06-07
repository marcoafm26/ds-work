# Dependências de Produção - Frontend

Este documento detalha todas as dependências de produção utilizadas no frontend do sistema bancário.

## @hookform/resolvers (^5.0.1)

**Descrição**: Resolvers para validação de formulários com React Hook Form usando diferentes bibliotecas de validação.

**Problema que resolve**:
- Integração entre React Hook Form e bibliotecas de validação
- Validação declarativa de formulários
- Melhor experiência do usuário com validação em tempo real
- Redução de código boilerplate

**Como usar**:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
  email: z.string().email('Email inválido')
})

type ClienteForm = z.infer<typeof clienteSchema>

export const ClienteFormulario = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ClienteForm>({
    resolver: zodResolver(clienteSchema)
  })
  
  const onSubmit = (data: ClienteForm) => {
    console.log('Dados válidos:', data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('nome')}
        placeholder="Nome completo"
      />
      {errors.nome && <span>{errors.nome.message}</span>}
      
      <input
        {...register('cpf')}
        placeholder="CPF"
      />
      {errors.cpf && <span>{errors.cpf.message}</span>}
      
      <input
        {...register('email')}
        type="email"
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Cadastrar</button>
    </form>
  )
}
```

## classnames (^2.5.1)

**Descrição**: Utilitário para concatenar classes CSS condicionalmente.

**Problema que resolve**:
- Aplicação condicional de classes CSS
- Código mais limpo e legível
- Evita concatenação manual de strings
- Suporte a diferentes tipos de entrada

**Como usar**:
```typescript
import classNames from 'classnames'

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  disabled,
  loading,
  children
}) => {
  const buttonClasses = classNames(
    'btn', // classe base
    {
      'btn-primary': variant === 'primary',
      'btn-secondary': variant === 'secondary',
      'btn-danger': variant === 'danger',
      'btn-sm': size === 'sm',
      'btn-md': size === 'md',
      'btn-lg': size === 'lg',
      'btn-disabled': disabled,
      'btn-loading': loading
    }
  )
  
  return (
    <button className={buttonClasses} disabled={disabled || loading}>
      {loading ? 'Carregando...' : children}
    </button>
  )
}
```

## generate-react-cli (^8.4.9)

**Descrição**: CLI para gerar componentes React com templates customizáveis.

**Problema que resolve**:
- Padronização de estrutura de componentes
- Aumento de produtividade
- Redução de código boilerplate
- Consistência no projeto

**Como usar**:
```bash
# Gerar componente
pnpm component MinhaComponente

# Gerar página
pnpm page MinhaPagina

# Resultado: src/components/MinhaComponente/
# ├── MinhaComponente.tsx
# ├── MinhaComponente.module.scss
# └── index.ts
```

## react (^19.1.0) e react-dom (^19.1.0)

**Descrição**: Biblioteca JavaScript para construir interfaces de usuário e sua integração com o DOM.

**Problema que resolve**:
- Criação de interfaces reativas
- Gerenciamento eficiente do DOM virtual
- Componentização da UI
- Estado e ciclo de vida de componentes

**Como usar**:
```typescript
import React, { useState, useEffect } from 'react'

interface Cliente {
  id: number
  nome: string
  email: string
}

export const ListaClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('/api/clientes')
        if (!response.ok) throw new Error('Erro ao buscar clientes')
        const data = await response.json()
        setClientes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }
    
    fetchClientes()
  }, [])
  
  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>
  
  return (
    <div>
      <h2>Lista de Clientes</h2>
      {clientes.map(cliente => (
        <div key={cliente.id} className="cliente-card">
          <h3>{cliente.nome}</h3>
          <p>{cliente.email}</p>
        </div>
      ))}
    </div>
  )
}
```

## react-hook-form (^7.57.0)

**Descrição**: Biblioteca para gerenciamento de formulários em React com foco em performance.

**Problema que resolve**:
- Gerenciamento eficiente de estado de formulários
- Validação performática
- Redução de re-renders
- API simples e intuitiva

**Como usar**:
```typescript
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contaSchema = z.object({
  numero: z.string().min(1, 'Número da conta é obrigatório'),
  tipo: z.enum(['corrente', 'poupanca']),
  saldoInicial: z.number().min(0, 'Saldo inicial deve ser positivo')
})

type ContaForm = z.infer<typeof contaSchema>

export const FormularioConta: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<ContaForm>({
    resolver: zodResolver(contaSchema),
    defaultValues: {
      tipo: 'corrente',
      saldoInicial: 0
    }
  })
  
  const onSubmit = async (data: ContaForm) => {
    try {
      const response = await fetch('/api/contas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        alert('Conta criada com sucesso!')
      }
    } catch (error) {
      alert('Erro ao criar conta')
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Número da Conta</label>
        <input {...register('numero')} />
        {errors.numero && <span>{errors.numero.message}</span>}
      </div>
      
      <div>
        <label>Tipo de Conta</label>
        <Controller
          name="tipo"
          control={control}
          render={({ field }) => (
            <select {...field}>
              <option value="corrente">Conta Corrente</option>
              <option value="poupanca">Poupança</option>
            </select>
          )}
        />
      </div>
      
      <div>
        <label>Saldo Inicial</label>
        <input
          type="number"
          step="0.01"
          {...register('saldoInicial', { valueAsNumber: true })}
        />
        {errors.saldoInicial && <span>{errors.saldoInicial.message}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Criando...' : 'Criar Conta'}
      </button>
    </form>
  )
}
```

## react-router-dom (^7.6.2)

**Descrição**: Roteamento declarativo para aplicações React.

**Problema que resolve**:
- Navegação entre páginas em SPA
- Gerenciamento de URLs
- Roteamento aninhado
- Proteção de rotas
- Navegação programática

**Como usar**:
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Componente de rota protegida
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="clientes/:id" element={<ClienteDetalhes />} />
          <Route path="contas" element={<ContasPage />} />
          <Route path="transacoes" element={<TransacoesPage />} />
        </Route>
        
        {/* Rota 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

// Hook personalizado para navegação
import { useNavigate } from 'react-router-dom'

export const useNavigation = () => {
  const navigate = useNavigate()
  
  const goToCliente = (id: number) => {
    navigate(`/clientes/${id}`)
  }
  
  const goBack = () => {
    navigate(-1)
  }
  
  return { goToCliente, goBack }
}
```

## zod (^3.25.55)

**Descrição**: Biblioteca de validação e parsing de schema TypeScript-first.

**Problema que resolve**:
- Validação type-safe de dados
- Parsing e transformação de dados
- Validação de APIs
- Geração automática de tipos TypeScript

**Como usar**:
```typescript
import { z } from 'zod'

// Schema para transação bancária
const transacaoSchema = z.object({
  tipo: z.enum(['deposito', 'saque', 'transferencia']),
  valor: z.number().positive('Valor deve ser positivo'),
  contaOrigemId: z.number().int().positive(),
  contaDestinoId: z.number().int().positive().optional(),
  descricao: z.string().max(255, 'Descrição muito longa').optional()
}).refine(data => {
  // Validação customizada: transferência precisa de conta destino
  if (data.tipo === 'transferencia' && !data.contaDestinoId) {
    return false
  }
  return true
}, {
  message: 'Transferência requer conta de destino',
  path: ['contaDestinoId']
})

// Tipo inferido automaticamente
type Transacao = z.infer<typeof transacaoSchema>

// Validação de dados da API
export const validarTransacao = (data: unknown): Transacao => {
  try {
    return transacaoSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

// Schema para resposta da API
const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional()
})

// Validação de resposta da API
const fetchTransacoes = async (): Promise<Transacao[]> => {
  const response = await fetch('/api/transacoes')
  const rawData = await response.json()
  
  const validatedResponse = apiResponseSchema.parse(rawData)
  
  if (!validatedResponse.success) {
    throw new Error(validatedResponse.error || 'Erro desconhecido')
  }
  
  return z.array(transacaoSchema).parse(validatedResponse.data)
}
```