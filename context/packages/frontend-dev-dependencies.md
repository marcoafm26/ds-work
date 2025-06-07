# Dependências de Desenvolvimento - Frontend

Este documento detalha todas as dependências de desenvolvimento utilizadas no frontend do sistema bancário.

## @eslint/js (^9.17.0)

**Descrição**: Configurações JavaScript recomendadas para ESLint.

**Problema que resolve**:
- Padronização de código JavaScript
- Detecção de erros e problemas de qualidade
- Melhores práticas de desenvolvimento
- Consistência no estilo de código

**Como usar**:
```javascript
// eslint.config.js
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2024,
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  }
]
```

## @types/node (^22.10.6)

**Descrição**: Definições de tipos TypeScript para Node.js.

**Problema que resolve**:
- Type safety para APIs do Node.js
- Autocompletar em IDEs
- Detecção de erros em tempo de compilação
- Melhor experiência de desenvolvimento

**Como usar**:
```typescript
// utils/fileUtils.ts
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export class ConfigManager {
  private configPath: string
  
  constructor(configDir: string) {
    this.configPath = join(configDir, 'config.json')
  }
  
  async loadConfig<T>(): Promise<T> {
    try {
      const data = await readFile(this.configPath, 'utf-8')
      return JSON.parse(data) as T
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new Error('Arquivo de configuração não encontrado')
      }
      throw error
    }
  }
  
  async saveConfig<T>(config: T): Promise<void> {
    const data = JSON.stringify(config, null, 2)
    await writeFile(this.configPath, data, 'utf-8')
  }
}

// Uso com tipos específicos
interface AppConfig {
  apiUrl: string
  timeout: number
  features: {
    enableNotifications: boolean
    enableAnalytics: boolean
  }
}

const configManager = new ConfigManager('./config')
const config = await configManager.loadConfig<AppConfig>()
```

## @types/react (^19.1.0) e @types/react-dom (^19.1.0)

**Descrição**: Definições de tipos TypeScript para React e React DOM.

**Problema que resolve**:
- Type safety para componentes React
- Props tipadas
- Eventos tipados
- Hooks tipados

**Como usar**:
```typescript
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'

interface User {
  id: number
  name: string
  email: string
}

interface UserFormProps {
  user?: User
  onSubmit: (user: Omit<User, 'id'>) => Promise<void>
  onCancel: () => void
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Nome"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  )
}
```

## @typescript-eslint/eslint-plugin (^8.19.1) e @typescript-eslint/parser (^8.19.1)

**Descrição**: Plugin e parser ESLint para TypeScript.

**Problema que resolve**:
- Linting específico para TypeScript
- Regras de qualidade de código TypeScript
- Integração entre ESLint e TypeScript
- Detecção de problemas específicos do TS

**Como usar**:
```javascript
// eslint.config.js
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error'
    }
  }
]
```

## @vitejs/plugin-react (^4.3.4)

**Descrição**: Plugin oficial do Vite para suporte ao React.

**Problema que resolve**:
- Integração React com Vite
- Hot Module Replacement (HMR)
- Transformação de JSX
- Otimizações de build

**Como usar**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      // Configurações do plugin React
      fastRefresh: true,
      jsxImportSource: '@emotion/react', // se usando Emotion
      babel: {
        plugins: [
          // Plugins Babel customizados se necessário
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          forms: ['react-hook-form', '@hookform/resolvers']
        }
      }
    }
  }
})
```

## eslint (^9.17.0)

**Descrição**: Ferramenta de linting para identificar e reportar padrões em código JavaScript/TypeScript.

**Problema que resolve**:
- Detecção de erros de sintaxe
- Aplicação de padrões de código
- Melhoria da qualidade do código
- Prevenção de bugs comuns

**Como usar**:
```json
// package.json scripts
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint src --ext .ts,.tsx,.js,.jsx --fix",
    "lint:check": "eslint src --ext .ts,.tsx,.js,.jsx --max-warnings 0"
  }
}
```

## globals (^15.14.0)

**Descrição**: Definições de variáveis globais para diferentes ambientes JavaScript.

**Problema que resolve**:
- Configuração de variáveis globais para ESLint
- Suporte a diferentes ambientes (browser, node, etc.)
- Evita erros de "undefined variable"

**Como usar**:
```javascript
// eslint.config.js
import globals from 'globals'

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024
      }
    }
  }
]
```

## typescript (^5.7.3)

**Descrição**: Superset tipado do JavaScript que compila para JavaScript puro.

**Problema que resolve**:
- Type safety em tempo de compilação
- Melhor experiência de desenvolvimento
- Refatoração segura
- Documentação através de tipos

**Como usar**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": [
    "src/**/*",
    "vite.config.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

## vite (^6.0.7)

**Descrição**: Ferramenta de build rápida para desenvolvimento web moderno.

**Problema que resolve**:
- Build e desenvolvimento extremamente rápidos
- Hot Module Replacement instantâneo
- Suporte nativo a ES modules
- Otimizações automáticas de produção

**Como usar**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Configuração do servidor de desenvolvimento
  server: {
    port: 3000,
    host: true, // permite acesso externo
    open: true, // abre o browser automaticamente
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  
  // Configuração de build
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor'
            }
            return 'vendor'
          }
        }
      }
    }
  },
  
  // Otimizações
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  
  // Variáveis de ambiente
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})
```

**Scripts de desenvolvimento**:
```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "build:analyze": "vite build --mode analyze"
  }
}
```