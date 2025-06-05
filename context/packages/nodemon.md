# Nodemon

## O que é o Nodemon?

O Nodemon é uma ferramenta que ajuda no desenvolvimento de aplicações Node.js ao reiniciar automaticamente a aplicação quando mudanças nos arquivos são detectadas. É essencial para um fluxo de desenvolvimento eficiente.

## Recursos Principais

### 1. **Auto-reload Inteligente**

-   Monitora mudanças em arquivos automaticamente
-   Reinicia a aplicação apenas quando necessário
-   Suporte a diferentes tipos de arquivo
-   Configuração flexível de padrões de monitoramento

### 2. **Configuração Flexível**

-   Arquivo de configuração `nodemon.json`
-   Configuração via linha de comando
-   Suporte a variáveis de ambiente
-   Integração com scripts npm

### 3. **Performance Otimizada**

-   Ignora automaticamente `node_modules`
-   Debounce para evitar reinicializações desnecessárias
-   Monitoramento eficiente de arquivos
-   Suporte a diferentes sistemas operacionais

## Instalação

```bash
# Instalação como dependência de desenvolvimento (recomendado)
pnpm add -D nodemon

# Instalação global (opcional)
pnpm add -g nodemon
```

## Configuração Básica

### 1. **Script no package.json**

```json
{
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "dev:debug": "nodemon --inspect index.js",
        "dev:watch": "nodemon --watch src --ext js,json index.js"
    }
}
```

### 2. **Arquivo de Configuração nodemon.json**

```json
{
    "watch": ["src", "config"],
    "ext": "js,json,env",
    "ignore": [
        "node_modules",
        "dist",
        "build",
        "logs",
        "*.test.js",
        "*.spec.js"
    ],
    "env": {
        "NODE_ENV": "development",
        "DEBUG": "app:*"
    },
    "delay": 1000,
    "verbose": true,
    "restartable": "rs",
    "colours": true
}
```

### 3. **Configuração Avançada**

```json
{
  "watch": ["src"],
  "ext": "js,mjs,json",
  "ignore": [
    "src/**/*.test.js",
    "src/**/*.spec.js",
    "node_modules",
    "coverage",
    "logs"
  ],
  "exec": "node --experimental-modules index.js",
  "env": {
    "NODE_ENV": "development",
    "PORT": "3000",
    "DEBUG": "myapp:*"
  },
  "events": {
    "start": "echo 'Iniciando aplicação...',
    "crash": "echo 'Aplicação crashou!'",
    "restart": "echo 'Reiniciando aplicação...'"
  },
  "delay": 2000,
  "runOnChangeOnly": false,
  "legacyWatch": false
}
```

## Uso no Projeto

### 1. **Desenvolvimento Básico**

```bash
# Iniciar aplicação em modo desenvolvimento
pnpm run dev

# Ou diretamente com nodemon
npx nodemon index.js
```

### 2. **Com Variáveis de Ambiente**

```bash
# Usando arquivo .env
nodemon --env-file .env index.js

# Definindo variáveis inline
NODE_ENV=development PORT=3001 nodemon index.js
```

### 3. **Monitoramento Específico**

```bash
# Monitorar apenas arquivos .js e .json
nodemon --ext js,json index.js

# Monitorar diretórios específicos
nodemon --watch src --watch config index.js

# Ignorar arquivos específicos
nodemon --ignore tests/ --ignore logs/ index.js
```

## Configurações para o Projeto Bancário

### 1. **Configuração Otimizada**

```json
{
  "watch": [
    "src",
    "routes",
    "controllers",
    "services",
    "repositories",
    "middlewares",
    "config",
    "index.js"
  ],
  "ext": "js,json,env",
  "ignore": [
    "node_modules/**/*",
    "prisma/migrations/**/*",
    "logs/**/*",
    "uploads/**/*",
    "dist/**/*",
    "coverage/**/*",
    "**/*.test.js",
    "**/*.spec.js"
  ],
  "env": {
    "NODE_ENV": "development",
    "PORT": "3000",
    "DEBUG": "banco:*"
  },
  "delay": 1500,
  "verbose": false,
  "restartable": "rs",
  "colours": true,
  "runOnChangeOnly": false,
  "events": {
    "start": "echo '🚀 Servidor bancário iniciando...',
    "restart": "echo '🔄 Reiniciando servidor...',
    "crash": "echo '💥 Servidor crashou! Verifique os logs.'"
  }
}
```

### 2. **Scripts Personalizados**

```json
{
    "scripts": {
        "dev": "nodemon index.js",
        "dev:debug": "nodemon --inspect=0.0.0.0:9229 index.js",
        "dev:prisma": "nodemon --watch prisma/schema.prisma --exec 'pnpm prisma generate && node index.js'",
        "dev:full": "nodemon --watch src --watch prisma/schema.prisma --exec 'pnpm prisma generate && node index.js'",
        "dev:test": "NODE_ENV=test nodemon --watch src --exec 'npm test'"
    }
}
```

### 3. **Integração com Prisma**

```json
{
  "watch": ["src", "prisma/schema.prisma"],
  "ext": "js,json,prisma",
  "ignore": ["prisma/migrations"],
  "exec": "pnpm prisma generate && node index.js",
  "env": {
    "NODE_ENV": "development"
  },
  "events": {
    "start": "echo '🔄 Gerando cliente Prisma e iniciando servidor...',
    "restart": "echo '🔄 Schema alterado, regenerando cliente Prisma...'"
  }
}
```

## Comandos Úteis

### 1. **Comandos Básicos**

```bash
# Iniciar com nodemon
nodemon index.js

# Reiniciar manualmente (digite 'rs' no terminal)
rs

# Parar o nodemon
Ctrl + C

# Iniciar com debug
nodemon --inspect index.js
```

### 2. **Comandos Avançados**

```bash
# Monitorar arquivos específicos
nodemon --watch src --watch config --ext js,json index.js

# Executar comando personalizado
nodemon --exec "node --experimental-modules index.js"

# Delay entre mudanças
nodemon --delay 2000ms index.js

# Modo verboso
nodemon --verbose index.js

# Usar configuração específica
nodemon --config nodemon-prod.json index.js
```

### 3. **Debugging**

```bash
# Debug com Chrome DevTools
nodemon --inspect index.js
# Acesse: chrome://inspect

# Debug com porta específica
nodemon --inspect=0.0.0.0:9229 index.js

# Debug com break no início
nodemon --inspect-brk index.js
```

## Integração com Ferramentas

### 1. **Com ESLint**

```json
{
    "events": {
        "restart": "eslint src/",
        "start": "echo 'Verificando código com ESLint...'"
    }
}
```

### 2. **Com Testes**

```json
{
    "scripts": {
        "test:watch": "nodemon --exec 'npm test' --watch src --watch tests"
    }
}
```

### 3. **Com Docker**

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Instalar nodemon globalmente
RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["nodemon", "index.js"]
```

## Monitoramento e Logs

### 1. **Configuração de Logs**

```javascript
// utils/logger.js
import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Em desenvolvimento, também log no console
if (process.env.NODE_ENV === 'development') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple()
        })
    );
}

export default logger;
```

### 2. **Eventos Personalizados**

```json
{
    "events": {
        "start": "echo '$(date): Servidor iniciado' >> logs/nodemon.log",
        "restart": "echo '$(date): Servidor reiniciado' >> logs/nodemon.log",
        "crash": "echo '$(date): Servidor crashou' >> logs/nodemon.log"
    }
}
```

## Performance e Otimização

### 1. **Configuração Otimizada**

```json
{
    "watch": ["src"],
    "ignore": ["node_modules", "logs", "uploads", "dist", "coverage", "*.log"],
    "delay": 1000,
    "runOnChangeOnly": true,
    "legacyWatch": false,
    "polling": false
}
```

### 2. **Reduzindo Uso de CPU**

```json
{
    "watch": ["src"],
    "ext": "js",
    "ignore": ["**/*.test.js", "node_modules"],
    "delay": 2000,
    "runOnChangeOnly": true
}
```

## Troubleshooting

### Problemas Comuns

1. **Reinicializações excessivas**

    ```json
    {
        "delay": 2000,
        "runOnChangeOnly": true,
        "ignore": ["logs/**/*", "uploads/**/*"]
    }
    ```

2. **Alto uso de CPU**

    ```json
    {
        "legacyWatch": false,
        "polling": false,
        "ignore": ["node_modules", "dist", "logs"]
    }
    ```

3. **Não detecta mudanças**

    ```json
    {
        "legacyWatch": true,
        "polling": true
    }
    ```

4. **Problemas com Docker**
    ```json
    {
        "legacyWatch": true,
        "polling": true,
        "delay": 3000
    }
    ```

### Comandos de Diagnóstico

```bash
# Verificar versão
nodemon --version

# Modo verboso para debug
nodemon --verbose index.js

# Listar arquivos monitorados
nodemon --watch src --verbose index.js

# Testar configuração
nodemon --help
```

## Boas Práticas

### 1. **Configuração**

-   Use arquivo `nodemon.json` para projetos complexos
-   Configure ignores adequadamente
-   Use delay para evitar reinicializações desnecessárias
-   Monitore apenas diretórios necessários

### 2. **Performance**

-   Ignore `node_modules` e arquivos temporários
-   Use `runOnChangeOnly` para melhor performance
-   Configure delay adequado (1-2 segundos)
-   Evite monitorar arquivos grandes

### 3. **Desenvolvimento**

-   Use scripts npm para diferentes ambientes
-   Configure variáveis de ambiente adequadamente
-   Implemente logs estruturados
-   Use eventos para automação

### 4. **Debugging**

-   Use `--inspect` para debugging
-   Configure breakpoints adequadamente
-   Use modo verboso para troubleshooting
-   Monitore uso de recursos

## Alternativas e Comparações

### 1. **PM2 (Produção)**

```bash
# PM2 para produção
pnpm add -g pm2
pm2 start index.js --name "banco-api"
```

### 2. **Forever**

```bash
# Forever (alternativa mais simples)
pnpm add -g forever
forever start index.js
```

### 3. **Node --watch (Node 18+)**

```bash
# Recurso nativo do Node.js
node --watch index.js
```

## Vantagens para o Projeto

1. **Produtividade**: Reinicialização automática economiza tempo
2. **Flexibilidade**: Configuração altamente customizável
3. **Integração**: Funciona bem com todas as ferramentas do projeto
4. **Debugging**: Suporte nativo a debugging
5. **Performance**: Monitoramento eficiente de arquivos
6. **Comunidade**: Ferramenta padrão da comunidade Node.js

## Configuração Final Recomendada

```json
{
    "watch": [
        "src",
        "routes",
        "controllers",
        "services",
        "repositories",
        "middlewares",
        "config"
    ],
    "ext": "js,json,env",
    "ignore": [
        "node_modules/**/*",
        "prisma/migrations/**/*",
        "logs/**/*",
        "uploads/**/*",
        "dist/**/*",
        "coverage/**/*",
        "**/*.test.js",
        "**/*.spec.js"
    ],
    "env": {
        "NODE_ENV": "development",
        "PORT": "3000"
    },
    "delay": 1500,
    "verbose": false,
    "restartable": "rs",
    "colours": true,
    "runOnChangeOnly": false,
    "legacyWatch": false,
    "events": {
        "start": "echo '🚀 API Bancária iniciada em modo desenvolvimento'",
        "restart": "echo '🔄 Reiniciando devido a mudanças nos arquivos...'"
    }
}
```
